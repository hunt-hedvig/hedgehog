import {
  Button,
  Checkbox as MuiCheckbox,
  FormControlLabel,
  MenuItem,
  Select as MuiSelect,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField as MuiTextField,
} from '@material-ui/core'
import { ActionMap, Container } from 'constate'
import format from 'date-fns/format'
import toDate from 'date-fns/toDate'
import { Field, FieldProps, Form, Formik, validateYupSchema } from 'formik'
import gql from 'graphql-tag'
import * as React from 'react'
import { Mutation } from 'react-apollo'
import styled from 'react-emotion'
import * as yup from 'yup'
import { Checkmark, Cross } from '../../../icons'
import { CustomPaper } from './Styles'

const CREATE_PAYMENT_QUERY = gql`
  query CreatePaymentQuery($id: ID!) {
    claim(id: $id) {
      payments {
        id
        amount
        note
        type
        timestamp
        exGratia
        transaction {
          status
        }
        status
      }
      events {
        text
        date
      }
    }
  }
`

const CREATE_PAYMENT_MUTATION = gql`
  mutation CreatePayment($id: ID!, $payment: ClaimPaymentInput!) {
    createClaimPayment(id: $id, payment: $payment) {
      payments {
        amount
        note
        type
        timestamp
        exGratia
        transaction {
          status
        }
      }
      events {
        text
        date
      }
    }
  }
`

interface Props {
  payments: Payment[]
  claimId: string
  directDebitStatus: boolean
}

interface Payment {
  id: string
  amount: {
    amount: string
    currency: string
  }
  note: string
  timestamp: string
  type: string
  exGratia: boolean
  status: string
}

interface TextFieldProps {
  placeholder: string
}

const Checkbox: React.SFC<FieldProps> = ({
  field: { onChange, onBlur, name, value },
}) => (
  <MuiCheckbox
    onChange={onChange}
    onBlur={onBlur}
    name={name}
    value={value || ''}
    color="primary"
  />
)

export const TextField: React.SFC<FieldProps & TextFieldProps> = ({
  field: { onChange, onBlur, name, value },
  placeholder,
}) => (
  <MuiTextField
    onChange={onChange}
    onBlur={onBlur}
    name={name}
    value={value || ''}
    placeholder={placeholder}
    autoComplete="off"
  />
)

export const Select: React.SFC<FieldProps> = ({
  field: { onChange, onBlur, name, value },
  children,
}) => (
  <MuiSelect onChange={onChange} onBlur={onBlur} name={name} value={value}>
    {children}
  </MuiSelect>
)

const CustomForm = styled(Form)({
  display: 'flex',
  flexDirection: 'column',
})

interface State {
  potentiallySanctioned: boolean
}

interface Actions {
  setPotentiallySanctioned: (potentiallySanction: boolean) => void
}

const actions: ActionMap<State, Actions> = {
  setPotentiallySanctioned: (potentiallySanctioned: boolean) => () => ({
    potentiallySanctioned,
  }),
}

interface FormData {
  amount: string
  note: string
  exGratia?: boolean
  type: string
  overridden?: boolean
}

const schema = yup.object().shape({
  amount: yup.string().required(),
  note: yup.string().required(),
  exGratia: yup.boolean(),
  type: yup
    .string()
    .oneOf(['Manual', 'Automatic'])
    .required(),
  overridden: yup.boolean().when('$potentiallySanctioned', {
    is: true,
    then: yup.boolean().required(),
  }),
})

const ClaimPayments: React.SFC<Props> = ({
  payments,
  claimId,
  directDebitStatus,
}) => (
  <Container<State, Actions>
    initialState={{ potentiallySanctioned: false }}
    actions={actions}
  >
    {({ potentiallySanctioned, setPotentiallySanctioned }) => (
      <Mutation
        mutation={CREATE_PAYMENT_MUTATION}
        update={(cache, { data: updateData }) => {
          cache.writeQuery({
            query: CREATE_PAYMENT_QUERY,
            variables: { id: claimId },
            data: {
              claim: {
                payments: updateData.createClaimPayment.payments,
                __typename: updateData.createClaimPayment.__typename,
                events: updateData.createClaimPayment.events,
              },
            },
          })
        }}
        onError={(error) => {
          console.error(error)
          // if (error.message === 'potentially sanctioned') {
          console.error('GraphQL error when trying to make a payment')
          setPotentiallySanctioned(true)
          // }
        }}
      >
        {(createPayment) => (
          <CustomPaper>
            <h3>Payments</h3>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Id</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Note</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Ex Gratia</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow
                    key={
                      payment.amount.amount +
                      payment.amount.currency +
                      payment.timestamp
                    }
                  >
                    <TableCell>{payment.id}</TableCell>
                    <TableCell>
                      {payment.amount.amount} {payment.amount.currency}
                    </TableCell>
                    <TableCell>{payment.note}</TableCell>
                    <TableCell>
                      {format(toDate(payment.timestamp), 'yyyy-MM-dd hh:mm:ss')}
                    </TableCell>
                    <TableCell>
                      {payment.exGratia ? <Checkmark /> : <Cross />}
                    </TableCell>
                    <TableCell>{payment.type}</TableCell>
                    <TableCell>{payment.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Formik<FormData>
              initialValues={{ type: 'Manual', amount: '', note: '' }}
              onSubmit={(values, { setSubmitting, resetForm }) => {
                createPayment({
                  variables: {
                    id: claimId,
                    payment: {
                      amount: {
                        amount: +values.amount,
                        currency: 'SEK',
                      },
                      note: values.note,
                      exGratia: values.exGratia || false,
                      type: values.type,
                    },
                  },
                })
                setSubmitting(false)
                resetForm()
              }}
              validationSchema={schema}
              validate={(values) => {
                try {
                  validateYupSchema<FormData>(values, schema, false, {
                    directDebitStatus,
                    potentiallySanctioned,
                  })
                } catch (err) {
                  throw new Error('An error occured with the validation ' + err)
                }
              }}
            >
              <CustomForm>
                <Field
                  component={TextField}
                  placeholder="Payment amount"
                  name="amount"
                />
                <Field component={TextField} placeholder="Note" name="note" />
                <FormControlLabel
                  label="Ex Gratia?"
                  control={<Field component={Checkbox} name="exGratia" />}
                />
                <Field component={Select} name="type">
                  <MenuItem value="Manual">Manual</MenuItem>
                  <MenuItem value="Automatic">Automatic</MenuItem>
                </Field>
                {potentiallySanctioned && (
                  <FormControlLabel
                    label="Override sanction list result (I promise that I have manually checked the list)"
                    control={<Field component={Checkbox} name="overridden" />}
                  />
                )}
                <Button type="submit" variant="contained" color="primary">
                  Create payment
                </Button>
              </CustomForm>
            </Formik>
          </CustomPaper>
        )}
      </Mutation>
    )}
  </Container>
)

export { ClaimPayments }
