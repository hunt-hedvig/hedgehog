import {
  Button as MuiButton,
  Checkbox as MuiCheckbox,
  FormControlLabel as MuiFormControlLabel,
  MenuItem as MuiMenuItem,
  withStyles,
} from '@material-ui/core'
import {
  ClaimPaymentInput,
  ClaimPaymentType,
  ClaimSwishPaymentInput,
  SanctionStatus,
  useCreateClaimPaymentMutation,
  useCreateSwishClaimPaymentMutation,
} from 'api/generated/graphql'

import { Field, FieldProps, Form, Formik } from 'formik'
import { Spinner } from 'hedvig-ui/sipnner'
import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { Market } from 'types/enums'
import { withShowNotification } from 'utils/notifications'
import { sleep } from 'utils/sleep'
import * as yup from 'yup'
import { FieldSelect } from '../../../shared/inputs/FieldSelect'
import { TextField } from '../../../shared/inputs/TextField'
import { MutationFeedbackBlock } from '../../../shared/MutationFeedbackBlock'
import { PaymentConfirmationDialog } from './PaymentConfirmationDialog'

interface Props {
  sanctionStatus?: SanctionStatus | null
  claimId: string
  refetch: () => Promise<any>
  identified: boolean
  market: string
  carrier: string
}

export interface PaymentFormData {
  amount: string
  deductible: string
  note: string
  exGratia?: boolean
  type: ClaimPaymentType | 'AutomaticSwish'
  overridden?: boolean
  phoneNumber?: string
  message?: string
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

const Checkbox: React.FC<FieldProps> = ({
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

const areSwishPayoutsEnabled = () => {
  return (window as any).HOPE_FEATURES?.swishPayoutsEnabled ?? false
}

const getPaymentValidationSchema = (isPotentiallySanctioned: boolean) =>
  yup.object().shape({
    ...(isPotentiallySanctioned && {
      overridden: yup
        .boolean()
        .required()
        .test(
          'overridden',
          'Override sanction list checkbox isn’t checked.',
          (value) => value === true,
        ),
    }),
    amount: yup.string().required(),
    note: yup
      .string()
      .min(5) // for some reason payment service enforces at least 5 chars in the note
      .required(),
    exGratia: yup.boolean(),
    type: yup
      .string()
      .oneOf(['Automatic', 'AutomaticSwish', 'IndemnityCost', 'Expense'])
      .required(),
    phoneNumber: yup.string().when('type', {
      is: 'AutomaticSwish',
      then: yup.string().required(),
      otherwise: yup.string().notRequired(),
    }),
    message: yup.string().when('type', {
      is: 'AutomaticSwish',
      then: yup.string().required(),
      otherwise: yup.string().notRequired(),
    }),
  })

export const ClaimPaymentComponent: React.FC<WithShowNotification & Props> = ({
  sanctionStatus,
  claimId,
  refetch,
  identified,
  market,
  carrier,
  showNotification,
}) => {
  const [createPayment, createPaymentProps] = useCreateClaimPaymentMutation()
  const [
    createSwishPayment,
    createSwishPaymentProps,
  ] = useCreateSwishClaimPaymentMutation()

  const [isConfirming, setIsConfirming] = useState(false)

  const [paymentStatus, setPaymentStatus] = useState<
    'COMPLETED' | 'FAILED' | null
  >(null)

  const isPotentiallySanctioned =
    sanctionStatus === SanctionStatus.Undetermined ||
    sanctionStatus === SanctionStatus.PartialHit

  useEffect(() => {
    if (createPaymentProps.data || createSwishPaymentProps.data) {
      setPaymentStatus('COMPLETED')
    } else if (createPaymentProps.error || createSwishPaymentProps.data) {
      setPaymentStatus('FAILED')
    } else {
      setPaymentStatus(null)
    }
  }, [
    createPaymentProps.data,
    createPaymentProps.error,
    createSwishPaymentProps.data,
    createSwishPaymentProps.error,
    setPaymentStatus,
  ])

  return (
    <Formik<PaymentFormData>
      initialValues={{
        type: ClaimPaymentType.Automatic,
        amount: '',
        deductible: '',
        note: '',
        overridden: false,
      }}
      onSubmit={() => {
        setIsConfirming(true)
      }}
      validationSchema={getPaymentValidationSchema(isPotentiallySanctioned)}
    >
      {({ values, resetForm, isValid }) => (
        <>
          <PaymentForm>
            <Field
              component={TextField}
              placeholder="Payment amount"
              name="amount"
              type="number"
            />
            <Field
              component={TextField}
              placeholder="Deductible"
              name="deductible"
              type="number"
            />
            <Field component={TextField} placeholder="Note" name="note" />
            <MuiFormControlLabel
              label="Ex Gratia?"
              control={<Field component={Checkbox} name="exGratia" />}
            />
            <Field component={FieldSelect} name="type">
              <MuiMenuItem value={ClaimPaymentType.Manual} disabled>
                Manual
              </MuiMenuItem>
              <MuiMenuItem value={ClaimPaymentType.Automatic}>
                Automatic
              </MuiMenuItem>
              {areSwishPayoutsEnabled() && market === Market.Sweden && (
                <MuiMenuItem value="AutomaticSwish">
                  Automatic (Swish)
                </MuiMenuItem>
              )}
              <MuiMenuItem value={ClaimPaymentType.IndemnityCost}>
                Indemnity Cost
              </MuiMenuItem>
              <MuiMenuItem value={ClaimPaymentType.Expense}>
                Expense
              </MuiMenuItem>
            </Field>

            {isPotentiallySanctioned && (
              <MuiFormControlLabel
                label="Override sanction list result (I promise that I have manually checked the list)"
                control={<Field component={Checkbox} name="overridden" />}
              />
            )}

            {values.type === 'AutomaticSwish' && (
              <>
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
              </>
            )}

            <SubmitButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={
                !isValid ||
                createPaymentProps.loading ||
                createSwishPaymentProps.loading
              }
            >
              {(createPaymentProps.loading ||
                createSwishPaymentProps.loading) && <Spinner />}
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
                const paymentInput: Partial<
                  ClaimPaymentInput | ClaimSwishPaymentInput
                > = {
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
                  carrier,
                }

                try {
                  if (values.type === 'AutomaticSwish') {
                    await createSwishPayment({
                      variables: {
                        id: claimId,
                        payment: {
                          ...(paymentInput as ClaimSwishPaymentInput),
                          phoneNumber: values.phoneNumber!,
                          message: values.message!,
                        },
                      },
                    })
                  } else {
                    await createPayment({
                      variables: {
                        id: claimId,
                        payment: {
                          ...(paymentInput as ClaimPaymentInput),
                          type: values.type,
                        },
                      },
                    })
                  }
                  showNotification({
                    type: 'olive',
                    message: 'Claim payment was made successfully',
                    header: 'Success',
                  })
                } catch (e) {
                  showNotification({
                    type: 'red',
                    message: 'Error while making claim payment: ' + e.message,
                    header: 'Error',
                  })
                  throw e
                }
                await sleep(1000)
                await refetch()
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

export const ClaimPayment = withShowNotification(ClaimPaymentComponent)
