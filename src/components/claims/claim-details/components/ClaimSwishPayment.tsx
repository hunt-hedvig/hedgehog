import {
  Button as MuiButton,
  Checkbox as MuiCheckbox,
  FormControlLabel as MuiFormControlLabel,
  withStyles,
} from '@material-ui/core'
import { SanctionStatus } from 'api/generated/graphql'

import { ActionMap, Container } from 'constate'
import { Field, FieldProps, Form, Formik, validateYupSchema } from 'formik'
import gql from 'graphql-tag'
import * as React from 'react'
import { Mutation } from 'react-apollo'
import styled from 'react-emotion'
import { sleep } from 'utils/sleep'
import * as yup from 'yup'
import { TextField } from '../../../shared/inputs/TextField'
import {
  MutationFeedbackBlock,
  MutationStatus,
} from '../../../shared/MutationFeedbackBlock'
import { SwishPaymentConfirmationDialog } from './SwishPaymentConfirmationDialog'

const CREATE_SWISH_PAYMENT_MUTATION = gql`
  mutation CreatePayment($id: ID!, $payment: ClaimSwishPaymentInput!) {
    createClaimSwishPayment(id: $id, payment: $payment) {
      payments {
        id
        amount
        deductible
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

interface Props {
  sanctionStatus: SanctionStatus
  claimId: string
  refetchPage: () => Promise<any>
}

interface State {
  initiatedPayment: PaymentSwishFormData | null
  paymentStatus: MutationStatus
}

interface Actions {
  initiatePayment: (payment: PaymentSwishFormData) => void
  closeInitiatedPayment: () => void
  setPaymentStatus: (paymentStatus: MutationStatus) => void
}

const actions: ActionMap<State, Actions> = {
  initiatePayment: (payment) => () => ({
    initiatedPayment: payment,
  }),
  closeInitiatedPayment: () => () => ({
    initiatedPayment: null,
  }),
  setPaymentStatus: (paymentStatus: MutationStatus) => () => ({
    paymentStatus,
  }),
}

export interface PaymentSwishFormData {
  amount: string
  deductible: string
  note: string
  exGratia: boolean
  phoneNumber: string
  message: string
  overridden: boolean
}

const PaymentForm = styled(Form)({
  marginTop: '1rem',
})

const SubmitButton = withStyles({
  root: {
    marginTop: '1rem',
    display: 'block',
  },
})(MuiButton)

const Checkbox: React.SFC<FieldProps> = ({
  field: { onChange, onBlur, name, value },
}) => (
  <MuiCheckbox
    onChange={onChange}
    onBlur={onBlur}
    name={name}
    checked={value || false}
    color="primary"
  />
)

const getPaymentValidationSchema = (isPotentiallySanctioned: boolean) =>
  yup.object().shape({
    ...(isPotentiallySanctioned && {
      overridden: yup
        .boolean()
        .required()
        .test(
          'overridden',
          'Override saction list checkbox isn’t checked.',
          (value) => value === false,
        ),
    }),
    amount: yup.string().required(),
    note: yup.string().required(),
    exGratia: yup.boolean(),
    type: yup
      .string()
      .oneOf(['Manual', 'Automatic'])
      .required(),
  })

export const ClaimSwishPayment: React.FC<Props> = ({
  sanctionStatus,
  claimId,
  refetchPage,
}) => {
  const isPotentiallySanctioned =
    sanctionStatus === 'Undetermined' || sanctionStatus === 'PartialHit'

  return (
    <Container<State, Actions>
      initialState={{
        initiatedPayment: null,
        paymentStatus: '',
      }}
      actions={actions}
    >
      {({
        initiatePayment,
        closeInitiatedPayment,
        initiatedPayment,
        paymentStatus,
        setPaymentStatus,
      }) => (
        <Mutation
          mutation={CREATE_SWISH_PAYMENT_MUTATION}
          onCompleted={() => {
            closeInitiatedPayment()
            setPaymentStatus('COMPLETED')
          }}
          onError={() => {
            closeInitiatedPayment()
            setPaymentStatus('FAILED')
          }}
        >
          {(createPayment) => (
            <Formik<PaymentSwishFormData>
              initialValues={{
                amount: '',
                deductible: '',
                note: '',
                phoneNumber: '',
                message: '',
                exGratia: false,
                overridden: false,
              }}
              onSubmit={(values, {}) => {
                initiatePayment(values)
              }}
              validationSchema={getPaymentValidationSchema(
                isPotentiallySanctioned,
              )}
              validate={(values) => {
                try {
                  validateYupSchema<PaymentSwishFormData>(
                    values,
                    getPaymentValidationSchema(isPotentiallySanctioned),
                    false,
                  )
                } catch (error) {
                  throw new Error(
                    'An error occured with the validation ' + error,
                  )
                }
              }}
            >
              {({ resetForm, isValid }) => (
                <>
                  <PaymentForm>
                    <Field
                      component={TextField}
                      placeholder="Payment amount"
                      name="amount"
                    />
                    <Field
                      component={TextField}
                      placeholder="Deductible"
                      name="deductible"
                    />
                    <Field
                      component={TextField}
                      placeholder="Note"
                      name="note"
                    />
                    <MuiFormControlLabel
                      label="Ex Gratia?"
                      control={<Field component={Checkbox} name="exGratia" />}
                    />
                    <Field
                      component={TextField}
                      placeholder="Phone number (467XXXXXXXX)"
                      name="phoneNumber"
                    />
                    <Field
                      component={TextField}
                      placeholder="Swish notification message"
                      name="message"
                    />
                    {isPotentiallySanctioned && (
                      <MuiFormControlLabel
                        label="Override sanction list result (I promise that I have manually checked the list)"
                        control={
                          <Field component={Checkbox} name="overridden" />
                        }
                      />
                    )}

                    <SubmitButton
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={!isValid}
                    >
                      Create payment
                    </SubmitButton>
                  </PaymentForm>

                  {initiatedPayment && (
                    <SwishPaymentConfirmationDialog
                      onClose={() => {
                        closeInitiatedPayment()
                        resetForm()
                      }}
                      onSubmit={async (graphqlArgs) => {
                        await createPayment(graphqlArgs)
                        await sleep(1000)
                        await refetchPage()
                      }}
                      payment={initiatedPayment}
                      claimId={claimId}
                    />
                  )}

                  {!!paymentStatus && (
                    <MutationFeedbackBlock
                      status={paymentStatus}
                      messages={{
                        COMPLETED: 'Payment was completed',
                        FAILED:
                          'Payment failed. Please contact tech support if failure is persistent.',
                      }}
                      onTimeout={() => setPaymentStatus('')}
                    />
                  )}
                </>
              )}
            </Formik>
          )}
        </Mutation>
      )}
    </Container>
  )
}
