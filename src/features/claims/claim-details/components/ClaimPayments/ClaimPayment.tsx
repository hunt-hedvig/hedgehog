import {
  Checkbox,
  Form,
  FormDropdown,
  FormInput,
  SubmitButton,
} from '@hedvig-ui'
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Market } from 'types/enums'
import {
  ClaimPaymentInput,
  ClaimPaymentType,
  ClaimSwishPaymentInput,
  SanctionStatus,
  useCreateClaimPaymentMutation,
  useCreateSwishClaimPaymentMutation,
} from 'types/generated/graphql'
import { PaymentConfirmationModal } from './PaymentConfirmationModal'

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
  identified: boolean
  market: string
  carrier: string
}> = ({ sanctionStatus, carrier, claimId, identified, market }) => {
  const [createPayment] = useCreateClaimPaymentMutation()
  const [createSwishPayment] = useCreateSwishClaimPaymentMutation()

  const [isConfirming, setIsConfirming] = useState(false)
  const [isExGratia, setIsExGratia] = useState(false)
  const [isOverridden, setIsOverridden] = useState(false)

  const categoryOptions = [
    ...Object.keys(ClaimPaymentType).map((paymentType, index) => ({
      key: index + 1,
      value: paymentType,
      text: paymentType,
      disabled: paymentType === ClaimPaymentType.Manual,
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

  const createPaymentHandler = async () => {
    const paymentInput: Partial<ClaimPaymentInput | ClaimSwishPaymentInput> = {
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
          success: () => {
            form.reset()
            setIsConfirming(false)
            setIsExGratia(false)
            return 'Claim Swish payment done'
          },
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
          success: () => {
            form.reset()
            setIsConfirming(false)
            setIsExGratia(false)
            return 'Claim payment done'
          },
          error: 'Could not make payment',
        },
      )
    }
  }

  return (
    <FormProvider {...form}>
      <Form onSubmit={() => setIsConfirming(true)}>
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

        {form.watch('type') === 'AutomaticSwish' && !isExGratia && (
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
          <PaymentConfirmationModal
            onClose={() => {
              setIsConfirming(false)
              form.reset()
            }}
            onSubmit={createPaymentHandler}
            amount={form.getValues().amount}
            identified={identified}
            market={market}
          />
        )}
      </Form>
    </FormProvider>
  )
}