import {
  Button as MuiButton,
  Checkbox as MuiCheckbox,
  FormControlLabel as MuiFormControlLabel,
  MenuItem as MuiMenuItem,
  withStyles,
} from '@material-ui/core'
import {
  ClaimPaymentType,
  SanctionStatus,
  useCreateClaimPaymentMutation,
} from 'api/generated/graphql'

import { Field, FieldProps, Form, Formik, validateYupSchema } from 'formik'
import React, { useEffect, useState } from 'react'
import styled from 'react-emotion'
import { sleep } from 'utils/sleep'
import * as yup from 'yup'
import { FieldSelect } from '../../../shared/inputs/FieldSelect'
import { TextField } from '../../../shared/inputs/TextField'
import { MutationFeedbackBlock } from '../../../shared/MutationFeedbackBlock'
import { PaymentConfirmationDialog } from './PaymentConfirmationDialog'

interface Props {
  sanctionStatus: SanctionStatus
  claimId: string
  refetchPage: () => Promise<any>
  identified: boolean
  market: string | null
  carrier: string
}

export interface PaymentFormData {
  amount: string
  deductible: string
  note: string
  exGratia?: boolean
  type: ClaimPaymentType
  overridden?: boolean
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
          (value) => value === true,
        ),
    }),
    amount: yup.string().required(),
    note: yup.string().required(),
    exGratia: yup.boolean(),
    type: yup
      .string()
      .oneOf(['Manual', 'Automatic', 'IndemnityCost', 'Expense'])
      .required(),
  })

export const ClaimPayment: React.FC<Props> = ({
  sanctionStatus,
  claimId,
  refetchPage,
  identified,
  market,
  carrier,
}) => {
  const [createPayment, createPaymentProps] = useCreateClaimPaymentMutation()

  const [isConfirming, setIsConfirming] = useState(false)

  const [paymentStatus, setPaymentStatus] = useState<
    'COMPLETED' | 'FAILED' | null
  >(null)

  const isPotentiallySanctioned =
    sanctionStatus === 'Undetermined' || sanctionStatus === 'PartialHit'

  useEffect(() => {
    if (createPaymentProps.data) {
      setPaymentStatus('COMPLETED')
    } else if (createPaymentProps.error) {
      setPaymentStatus('FAILED')
    } else {
      setPaymentStatus(null)
    }
  }, [createPaymentProps.data, createPaymentProps.error, setPaymentStatus])

  return (
    <Formik<PaymentFormData>
      initialValues={{
        type: ClaimPaymentType.Manual,
        amount: '',
        deductible: '',
        note: '',
        overridden: false,
      }}
      onSubmit={() => {
        setIsConfirming(true)
      }}
      validationSchema={getPaymentValidationSchema(isPotentiallySanctioned)}
      validate={(values) => {
        try {
          validateYupSchema<PaymentFormData>(
            values,
            getPaymentValidationSchema(isPotentiallySanctioned),
            false,
          )
        } catch (error) {
          throw new Error('An error occurred with the validation ' + error)
        }
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
            <Field component={FieldSelect} name="type">
              <MuiMenuItem value="Manual">Manual</MuiMenuItem>
              <MuiMenuItem value="Automatic">Automatic</MuiMenuItem>
              <MuiMenuItem value="IndemnityCost">Indemnity Cost</MuiMenuItem>
              <MuiMenuItem value="Expense">Expense</MuiMenuItem>
            </Field>

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
                await createPayment({
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
                      type: values.type,
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
