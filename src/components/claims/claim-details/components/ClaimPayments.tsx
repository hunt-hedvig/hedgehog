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
import format from 'date-fns/format'
import toDate from 'date-fns/toDate'
import { Field, FieldProps, Form, Formik } from 'formik'
import gql from 'graphql-tag'
import * as React from 'react'
import { Mutation } from 'react-apollo'
import styled from 'react-emotion'
import { Checkmark, Cross } from '../../../icons'
import { CustomPaper } from './Styles'

const CREATE_PAYMENT_QUERY = gql`
  query CreatePaymentQuery($id: ID!) {
    claim(id: $id) {
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
}

interface Payment {
  amount: {
    amount: string
    currency: string
  }
  note: string
  timestamp: string
  type: string
  exGratia: boolean
}

interface TextFieldProps {
  placeholder: string
}

const Checbox: React.SFC<FieldProps> = ({
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

const ClaimPayments: React.SFC<Props> = ({ payments, claimId }) => (
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
  >
    {(createPayment) => (
      <CustomPaper>
        <h3>Payments</h3>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Amount</TableCell>
              <TableCell>Note</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Ex Gratia</TableCell>
              <TableCell>Type</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Formik<{
          amount: string
          note: string
          exGratia?: boolean
          type: string
        }>
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
              control={<Field component={Checbox} name="exGratia" />}
            />
            <Field component={Select} name="type">
              <MenuItem value="Manual">Manual</MenuItem>
              <MenuItem value="Automatic">Automatic</MenuItem>
            </Field>
            <Button type="submit" variant="contained" color="primary">
              Create payment
            </Button>
          </CustomForm>
        </Formik>
      </CustomPaper>
    )}
  </Mutation>
)

export { ClaimPayments }
