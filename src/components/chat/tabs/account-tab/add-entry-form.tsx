import { Button as MuiButton, MenuItem, withStyles } from '@material-ui/core'
import { gql } from 'apollo-boost'
import { GET_MEMBER_ACCOUNT_QUERY } from 'components/chat/tabs/AccountTab'
import { DatePicker } from 'components/shared/inputs/DatePicker'
import { FieldSelect } from 'components/shared/inputs/FieldSelect'
import { TextField as MuiTextField } from 'components/shared/inputs/TextField'
import { format, startOfDay } from 'date-fns'
import { Field, Form as FormikForm, Formik } from 'formik'
import * as React from 'react'
import { Mutation } from 'react-apollo'
import styled from 'react-emotion'
import * as yup from 'yup'

const ADD_ACCOUNT_ENTRY_MUTATION = gql`
  mutation addAccountEntryToMember(
    $memberId: ID!
    $accountEntry: AccountEntryInput!
  ) {
    addAccountEntryToMember(memberId: $memberId, accountEntry: $accountEntry) {
      memberId
    }
  }
`

interface State {
  confirmed: boolean
}

const SubmitButton = withStyles({
  root: {
    display: 'block',
    marginTop: '1rem',
    marginLeft: 'auto',
  },
})(MuiButton)

const TextField = withStyles({
  root: {
    display: 'block',
    width: '100%',
  },
})(MuiTextField)

const Form = styled(FormikForm)({ width: '100%' })
const BottomRowWrapper = styled('div')({
  display: 'flex',
  alignItems: 'center',
  '> div:first-of-type': {
    flex: 1,
  },
})

const parseAmount = (amount: string) => parseFloat(amount.replace(/\s+/g, ''))

const getValidationSchema = () =>
  yup.object().shape({
    type: yup
      .string()
      .oneOf(['CORRECTION', 'CAMPAIGN', 'FEE', 'PAYMENT'])
      .required(),
    amount: yup.number().required(),
    reference: yup
      .string()
      .max(50)
      .required(),
    source: yup
      .string()
      .max(15)
      .required(),
    title: yup
      .string()
      .max(100)
      .nullable(true),
    comment: yup
      .string()
      .max(500)
      .nullable(true),
    fromDate: yup.date().min(startOfDay(new Date())),
  })

export class AddEntryForm extends React.Component<
  {
    memberId: string
    firstName: string
    showNotification: (data: any) => void
  },
  State
> {
  public state = {
    confirmed: false,
  }

  public render() {
    return (
      <Mutation
        mutation={ADD_ACCOUNT_ENTRY_MUTATION}
        refetchQueries={() => [
          {
            query: GET_MEMBER_ACCOUNT_QUERY,
            variables: { memberId: this.props.memberId },
          },
        ]}
      >
        {(mutation, { loading }) => (
          <Formik
            initialValues={{
              type: '',
              amount: '',
              reference: '',
              source: '',
              title: '',
              comment: '',
              fromDate: new Date(),
            }}
            onSubmit={(formData: any, { resetForm }) => {
              if (!this.state.confirmed || loading) {
                return
              }

              mutation({
                variables: {
                  memberId: this.props.memberId,
                  accountEntry: {
                    type: formData.type,
                    amount: {
                      amount: parseAmount(formData.amount),
                      currency: 'SEK',
                    },
                    fromDate: format(formData.fromDate, 'yyyy-MM-dd'),
                    reference: formData.reference,
                    source: formData.source,
                    title: formData.title,
                    comment: formData.comment,
                  },
                },
              })
                .then(() => {
                  this.props.showNotification({
                    message: 'Account entry added.',
                    header: 'Success',
                    type: 'olive',
                  })
                  resetForm()
                  this.resetConfirmed()
                })
                .catch((error) => {
                  this.props.showNotification({
                    message: error.message,
                    header: 'Error',
                    type: 'red',
                  })

                  throw error
                })
            }}
            validationSchema={getValidationSchema()}
          >
            {({ values, isValid }) => {
              const parsedAmount = parseAmount(values.amount)

              return (
                <Form onChange={this.resetConfirmed}>
                  <Field component={FieldSelect} name="type">
                    <MenuItem value="CORRECTION">Correction</MenuItem>
                    <MenuItem value="CAMPAIGN">Campaign</MenuItem>
                    <MenuItem value="FEE">Fee</MenuItem>
                    <MenuItem value="PAYMENT">Payment</MenuItem>
                  </Field>
                  <Field
                    component={TextField}
                    label="Amount"
                    type="number"
                    name="amount"
                  />
                  <Field
                    component={TextField}
                    label="Reference"
                    name="reference"
                    placeholder="123123"
                  />
                  <Field
                    component={TextField}
                    label="Source"
                    name="source"
                    placeholder="Member"
                  />
                  <Field
                    component={TextField}
                    label="Title"
                    name="title"
                    placeholder="Återbetalning dubbeldragning"
                  />
                  <Field component={TextField} label="Comment" name="comment" />
                  <Field
                    component={DatePicker}
                    label="From date"
                    type="date"
                    name="fromDate"
                  />

                  <BottomRowWrapper>
                    <div>
                      {!isNaN(parsedAmount) &&
                        parsedAmount !== 0 &&
                        (parsedAmount > 0 ? (
                          <>
                            {this.props.firstName} will owe us {parsedAmount}{' '}
                            <strong>less</strong>
                          </>
                        ) : (
                          <>
                            {this.props.firstName} will owe us{' '}
                            {parsedAmount * -1} <strong>more</strong>
                          </>
                        ))}
                    </div>
                    <div>
                      {!this.state.confirmed ? (
                        <SubmitButton
                          type="button"
                          variant="contained"
                          color="secondary"
                          onClick={(e) => {
                            e.preventDefault()
                            this.toggleConfirmed()
                          }}
                          disabled={!isValid || loading}
                        >
                          Confirm entry
                        </SubmitButton>
                      ) : (
                        <SubmitButton
                          type="submit"
                          variant="contained"
                          color="primary"
                          disabled={!isValid || loading}
                        >
                          Create entry
                        </SubmitButton>
                      )}
                    </div>
                  </BottomRowWrapper>
                </Form>
              )
            }}
          </Formik>
        )}
      </Mutation>
    )
  }

  private resetConfirmed = () => this.setState({ confirmed: false })

  private toggleConfirmed = () =>
    this.setState((state) => ({ confirmed: !state.confirmed }))
}
