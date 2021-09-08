import {
  ClaimPaymentInput,
  ClaimPaymentType,
  ClaimSwishPaymentInput,
  SanctionStatus,
  useCreateClaimPaymentMutation,
  useCreateSwishClaimPaymentMutation,
} from 'api/generated/graphql'
import { Checkbox } from 'hedvig-ui/checkbox'
import { Form, FormDropdown, FormInput, SubmitButton } from 'hedvig-ui/form'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Market } from 'types/enums'
import { sleep } from 'utils/sleep'
import { MutationFeedbackBlock } from '../../../shared/MutationFeedbackBlock'
import { PaymentConfirmationDialog } from './PaymentConfirmationDialog'

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

const areSwishPayoutsEnabled = () => {
  return (window as any).HOPE_FEATURES?.swishPayoutsEnabled ?? false
}

export const ClaimPayment: React.FC<{
  sanctionStatus?: SanctionStatus | null
  claimId: string
  refetch: () => Promise<any>
  identified: boolean
  market: string
  carrier: string
}> = ({ sanctionStatus, carrier, claimId, identified, market, refetch }) => {
  const [createPayment, createPaymentProps] = useCreateClaimPaymentMutation()
  const [
    createSwishPayment,
    createSwishPaymentProps,
  ] = useCreateSwishClaimPaymentMutation()

  const [isConfirming, setIsConfirming] = useState(false)
  const [isExGratia, setIsExGratia] = useState(false)
  const [isOverridden, setIsOverridden] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<
    'COMPLETED' | 'FAILED' | null
  >(null)
  const categoryOptions = [
    ...Object.keys(ClaimPaymentType).map((el, idx) => ({
      key: idx + 1,
      value: el,
      text: el,
      disabled: el === ClaimPaymentType.Manual,
    })),
    {
      key: 5,
      value: 'AutomaticSwish',
      text: 'AutomaticSwish',
    },
  ]

  const form = useForm()

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
  ])

  const onSubmitHandler = (e: any) => {
    setIsConfirming(true)
  }

  return (
    <FormProvider {...form}>
      <Form onSubmit={onSubmitHandler}>
        <FormInput
          placeholder="Payout amount"
          name="amount"
          defaultValue=""
          type="number"
          affix={{
            content: 'SEK',
            basic: true,
          }}
          affixPosition="right"
          rules={{
            required: 'Amount is required',
            pattern: {
              value: /[^0]/,
              message: 'Amount cannot be zero',
            },
          }}
        />
        <FormInput
          placeholder="Deductible"
          name="deductible"
          defaultValue=""
          type="number"
        />
        <FormInput
          placeholder="Note"
          name="note"
          defaultValue=""
          rules={{
            required: 'Note is required',
          }}
        />
        <Checkbox
          label="Ex Gratia?"
          name="exGratia"
          className="field"
          checked={isExGratia}
          onChange={() => setIsExGratia((prev) => !prev)}
        />
        <FormDropdown
          options={categoryOptions.filter((opt) => {
            if (opt.value === 'AutomaticSwish') {
              return (
                areSwishPayoutsEnabled() &&
                market === Market.Sweden &&
                !isExGratia
              )
            }
            return isExGratia ? opt.value !== ClaimPaymentType.Automatic : true
          })}
          name="type"
          defaultValue={ClaimPaymentType.Automatic}
          rules={{
            required: 'Category is required',
          }}
        />

        {isPotentiallySanctioned && (
          <Checkbox
            label="Override sanction list result (I promise that I have manually checked the list)"
            name="overriden"
            className="field"
            checked={isOverridden}
            onChange={() => setIsOverridden((prev) => !prev)}
          />
        )}

        {form.getValues().type === 'AutomaticSwish' && (
          <>
            <FormInput
              defaultValue=""
              placeholder="Phone number (467XXXXXXXX)"
              name="phoneNumber"
              rules={{
                required: 'Phone number is required',
              }}
            />
            <FormInput
              defaultValue=""
              placeholder="Swish notification message"
              name="message"
              rules={{
                required: 'Notification message is required',
              }}
            />
          </>
        )}

        <SubmitButton variation="primary">Create payment</SubmitButton>

        {isConfirming && (
          <PaymentConfirmationDialog
            onClose={() => {
              setIsConfirming(false)
              form.reset()
            }}
            onSubmit={async () => {
              const paymentInput: Partial<
                ClaimPaymentInput | ClaimSwishPaymentInput
              > = {
                amount: {
                  amount: +form.getValues().amount,
                  currency: 'SEK',
                },
                deductible: {
                  amount: +form.getValues().deductible,
                  currency: 'SEK',
                },
                sanctionListSkipped: Boolean(isOverridden),
                note: form.getValues().note,
                exGratia: isExGratia,
                carrier,
              }

              if (form.getValues().type === 'AutomaticSwish') {
                await toast.promise(
                  createSwishPayment({
                    variables: {
                      id: claimId,
                      payment: {
                        ...(paymentInput as ClaimSwishPaymentInput),
                        phoneNumber: form.getValues().phoneNumber!,
                        message: form.getValues().message!,
                      },
                    },
                  }),
                  {
                    loading: 'Creating Swish payment',
                    success: 'Claim Swish payment done',
                    error: 'Could not make Swish payment',
                  },
                )
              } else {
                await toast.promise(
                  createPayment({
                    variables: {
                      id: claimId,
                      payment: {
                        ...(paymentInput as ClaimPaymentInput),
                        type: form.getValues().type,
                      },
                    },
                  }),
                  {
                    loading: 'Creating payment',
                    success: 'Claim payment done',
                    error: 'Could not make payment',
                  },
                )
              }
              await sleep(1000)
              await refetch()
            }}
            amount={form.getValues().amount}
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
      </Form>
    </FormProvider>
  )
}
