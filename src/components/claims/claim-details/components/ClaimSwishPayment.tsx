import {
  Button as MuiButton,
  Checkbox as MuiCheckbox,
  FormControlLabel as MuiFormControlLabel,
  withStyles,
} from '@material-ui/core'
import {
  SanctionStatus,
  useCreateSwishClaimPaymentMutation,
} from 'api/generated/graphql'
import { PaymentConfirmationDialog } from 'components/claims/claim-details/components/PaymentConfirmationDialog'

import { Field, FieldProps, Form, Formik, validateYupSchema } from 'formik'
import React, { useEffect, useState } from 'react'
import styled from 'react-emotion'
import { sleep } from 'utils/sleep'
import * as yup from 'yup'
import { TextField } from '../../../shared/inputs/TextField'
import { MutationFeedbackBlock } from '../../../shared/MutationFeedbackBlock'

interface Props {
  sanctionStatus: SanctionStatus
  claimId: string
  refetchPage: () => Promise<void>
  identified
  market
  carrier
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

const getSwishPaymentValidationSchema = (isPotentiallySanctioned: boolean) =>
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
    phoneNumber: yup.string().required(),
    message: yup.string().required(),
    exGratia: yup.boolean(),
  })

export const ClaimSwishPayment: React.FC<Props> = ({
  sanctionStatus,
  claimId,
  refetchPage,
  identified,
  market,
  carrier,
}) => {
  const [
    createSwishPayment,
    createSwishPaymentProps,
  ] = useCreateSwishClaimsPaymentMutation()

  const [isConfirming, setIsConfirming] = useState(false)

  const [paymentStatus, setPaymentStatus] = useState<
    'COMPLETED' | 'FAILED' | null
  >(null)

  const isPotentiallySanctioned =
    sanctionStatus === 'Undetermined' || sanctionStatus === 'PartialHit'

  useEffect(() => {
    if (createSwishPaymentProps.data) {
      setPaymentStatus('COMPLETED')
    } else if (createSwishPaymentProps.error) {
      setPaymentStatus('FAILED')
    } else {
      setPaymentStatus(null)
    }
  }, [
    createSwishPaymentProps.data,
    createSwishPaymentProps.error,
    setPaymentStatus,
  ])

  return (
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
      onSubmit={() => {
        setIsConfirming(true)
      }}
      validationSchema={getSwishPaymentValidationSchema(
        isPotentiallySanctioned,
      )}
      validate={(values) => {
        validateYupSchema<PaymentSwishFormData>(
          values,
          getSwishPaymentValidationSchema(isPotentiallySanctioned),
          false,
        )
      }}
    >
      {({ values, resetForm, isValid }) => (
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
            <Field component={TextField} placeholder="Note" name="note" />
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
                control={<Field component={Checkbox} name="overridden" />}
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

          {isConfirming && (
            <PaymentConfirmationDialog
              onClose={() => {
                setIsConfirming(false)
                resetForm()
              }}
              onSubmit={async () => {
                await createSwishPayment({
                  variables: {
                    id: claimId,
                    payment: {
                      amount: {
                        amount: +values.amount,
                        currency: 'SEK',
                      },
                      deductible: {
                        amount: +values.deductible,
                        currency: 'SEK',
                      },
                      sanctionListSkipped: Boolean(values.overridden),
                      note: values.note,
                      exGratia: values.exGratia || false,
                      phoneNumber: values.phoneNumber,
                      message: values.message,
                      carrier,
                    },
                  },
                })
                await sleep(1000)
                await refetchPage()
                setIsConfirming(false)
              }}
              amount={values.amount}
              identified={identified}
              market={market}
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
              onTimeout={() => setPaymentStatus(null)}
            />
          )}
        </>
      )}
    </Formik>
  )
}
