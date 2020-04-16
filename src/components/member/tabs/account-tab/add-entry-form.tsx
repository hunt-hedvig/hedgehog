import { Button as MuiButton, MenuItem, withStyles } from '@material-ui/core'
import { gql } from 'apollo-boost'
import { FormikDatePicker } from 'components/shared/inputs/DatePicker'
import { FieldSelect } from 'components/shared/inputs/FieldSelect'
import { TextField as MuiTextField } from 'components/shared/inputs/TextField'
import { format, startOfDay } from 'date-fns'
import { Field, Form as FormikForm, Formik } from 'formik'
import * as React from 'react'
import { Mutation } from 'react-apollo'
import styled from 'react-emotion'
import { formatMoney } from 'utils/money'
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

export const SubmitButton = withStyles({
  root: {
    display: 'block',
    marginTop: '1rem',
    marginBottom: '1rem',
    marginLeft: 'auto',
  },
})(MuiButton)

const TextField = withStyles({
  root: {
    display: 'block',
    width: '100%',
  },
})(MuiTextField)

const Form = styled(FormikForm)({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
})
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
      .oneOf(['CAMPAIGN', 'SUBSCRIPTION', 'LOSS', 'CHARGE'])
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

export const AddEntryForm: React.FC<{
  memberId: string
  preferredCurrency: string
  showNotification: (data: any) => void
}> = ({ memberId, preferredCurrency, showNotification }) => {
  const [confirmed, setConfirmed] = React.useState<boolean>(false)

  return (
    <Mutation mutation={ADD_ACCOUNT_ENTRY_MUTATION}>
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
            if (!confirmed || loading) {
              return
            }

            mutation({
              variables: {
                memberId,
                accountEntry: {
                  type: formData.type,
                  amount: {
                    amount: parseAmount(formData.amount),
                    currency: preferredCurrency,
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
                showNotification({
                  message: 'Account entry added.',
                  header: 'Success',
                  type: 'olive',
                })
                resetForm()
                setConfirmed(false)
              })
              .catch((error) => {
                showNotification({
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
              <Form onChange={() => setConfirmed(false)}>
                <Field component={FieldSelect} name="type">
                  <MenuItem value="CAMPAIGN">
                    <strong>Campaign</strong>: The member owes/will owe us money
                    but we want to pay for it with marketing budget
                  </MenuItem>
                  <MenuItem value="SUBSCRIPTION">
                    <strong>Subscription</strong>: The member should owe us more
                    money, e.g. object insurance, travel insurance, incorrectly
                    fetched premiums
                  </MenuItem>
                  <MenuItem value="LOSS">
                    <strong>Loss</strong>: The member owes us money we will
                    never get, e.g. the member terminated its insurance or we
                    had a too early start date
                  </MenuItem>
                  <MenuItem value="CORRECTION">
                    <strong>Correction</strong>: A calculation is incorrect
                    (should hopefully never have to be used)
                  </MenuItem>
                </Field>
                <Field
                  component={TextField}
                  label="Amount"
                  type="number"
                  name="amount"
                />
                <Field
                  component={TextField}
                  label="Source"
                  name="source"
                  placeholder="(Required) This is where we look when we want to know the source, e.g. travel insurance, object insurance, marketing, IEX"
                />
                <Field
                  component={TextField}
                  label="Reference"
                  name="reference"
                  placeholder="(Required) This is what we look at when we want to know which source this is referring to, e.g. object insurance id, campaign code, member ID"
                />
                <Field
                  component={TextField}
                  label="Title"
                  name="title"
                  placeholder="(Optional) If this is to be shown in the app at a later point, this is the title of the entry"
                />
                <Field
                  component={TextField}
                  label="Comment"
                  name="comment"
                  placeholder="(Optional) Notes on what happened, maybe a calculation or statement on what happened"
                />
                <Field
                  component={FormikDatePicker}
                  label="From Date"
                  type="date"
                  name="fromDate"
                />

                <BottomRowWrapper>
                  <div>
                    {!isNaN(parsedAmount) &&
                      parsedAmount !== 0 &&
                      (parsedAmount < 0 ? (
                        <>
                          {memberId} will owe us{' '}
                          {formatMoney({
                            amount: parsedAmount * -1,
                            currency: preferredCurrency,
                          })}{' '}
                          <strong>less</strong>
                        </>
                      ) : (
                        <>
                          {memberId} will owe us{' '}
                          {formatMoney({
                            amount: parsedAmount,
                            currency: preferredCurrency,
                          })}{' '}
                          <strong>more</strong>
                        </>
                      ))}
                  </div>
                  <div>
                    {!confirmed ? (
                      <SubmitButton
                        type="button"
                        variant="contained"
                        color="secondary"
                        onClick={(e) => {
                          e.preventDefault()
                          setConfirmed(!confirmed)
                        }}
                        disabled={!isValid || loading}
                      >
                        Are you sure you want to add this entry?'
                      </SubmitButton>
                    ) : (
                      <SubmitButton
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={!isValid || loading}
                      >
                        Click again to confirm
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
