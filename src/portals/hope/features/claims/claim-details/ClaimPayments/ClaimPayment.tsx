import styled from '@emotion/styled'
import {
  Checkbox,
  Form,
  FormDropdown,
  FormInput,
  SubmitButton,
  TextDatePicker,
} from '@hedvig-ui'
import { Market } from 'portals/hope/features/config/constants'
import React, { useEffect, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import {
  ClaimPaymentInput,
  ClaimPaymentType,
  ClaimSwishPaymentInput,
  SanctionStatus,
  useCreateClaimPaymentMutation,
  useCreateSwishClaimPaymentMutation,
  useGetMemberTransactionsQuery,
} from 'types/generated/graphql'
import { PaymentConfirmationModal } from './PaymentConfirmationModal'

const areSwishPayoutsEnabled = () => {
  return (
    (
      window as Window &
        typeof global & { HOPE_FEATURES: { swishPayoutsEnabled?: boolean } }
    ).HOPE_FEATURES?.swishPayoutsEnabled ?? false
  )
}

const FormCheckbox = styled(Checkbox)`
  .checkbox__input {
    border: none !important;
  }
`

interface CategoryOptionsType {
  key: number
  value: string
  text: string
  disabled?: boolean
}

export const ClaimPayment: React.FC<{
  sanctionStatus?: SanctionStatus | null
  claimId: string
  identified: boolean
  market?: string
  carrier: string
  memberId: string
}> = ({ sanctionStatus, carrier, claimId, identified, market, memberId }) => {
  const { data: memberData } = useGetMemberTransactionsQuery({
    variables: { id: memberId },
  })
  const [createPayment, { loading }] = useCreateClaimPaymentMutation()
  const [createSwishPayment] = useCreateSwishClaimPaymentMutation()

  const [isConfirming, setIsConfirming] = useState(false)
  const [isExGratia, setIsExGratia] = useState(false)
  const [isOverridden, setIsOverridden] = useState(false)
  const [date, setDate] = useState<string | null>(null)

  const isPaymentActivated =
    !!memberData?.member?.directDebitStatus?.activated ||
    !!memberData?.member?.payoutMethodStatus?.activated

  const categoryOptions: CategoryOptionsType[] = [
    ...Object.keys(ClaimPaymentType).map((paymentType, index) => ({
      key: index + 1,
      value: paymentType,
      text: paymentType,
      disabled:
        paymentType === ClaimPaymentType.Manual ||
        (paymentType === ClaimPaymentType.Automatic &&
          !loading &&
          !isPaymentActivated),
    })),
    {
      key: 5,
      value: 'AutomaticSwish',
      text: 'AutomaticSwish',
    },
  ]

  const form = useForm()

  const clearFormHandler = () => {
    form.setValue('amount', '')
    form.setValue('deductible', '')
    form.setValue('note', '')
    setIsExGratia(false)
    setDate(null)
    form.setValue('type', ClaimPaymentType.Automatic)
    form.reset()
  }

  const isPotentiallySanctioned =
    sanctionStatus === SanctionStatus.Undetermined ||
    sanctionStatus === SanctionStatus.PartialHit

  useEffect(() => {
    if (isExGratia && form.getValues().type === ClaimPaymentType.Automatic) {
      form.setValue('type', undefined)
    }
    if (
      !isExGratia &&
      form.getValues().type === undefined &&
      isPaymentActivated
    ) {
      form.setValue('type', ClaimPaymentType.Automatic)
    }
  }, [isExGratia, loading])

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
      paidAt:
        form.getValues().type !== ClaimPaymentType.Automatic && date
          ? `${date}T00:00:00.000Z`
          : null,
    }

    if (form.getValues().type === 'AutomaticSwish') {
      await toast.promise(
        createSwishPayment({
          variables: {
            id: claimId,
            payment: {
              ...(paymentInput as ClaimSwishPaymentInput),
              phoneNumber: form.getValues().phoneNumber,
              message: form.getValues().message,
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
          error: (e) => {
            console.error(e)
            return 'Could not make payment'
          },
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
          affix={{ content: 'SEK' }}
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
        <FormCheckbox
          label="Ex Gratia?"
          name="exGratia"
          style={{ marginBottom: 15 }}
          checked={isExGratia}
          onChange={() => setIsExGratia((prev) => !prev)}
        />

        <FormDropdown
          placeholder="Type"
          options={categoryOptions.filter((opt) => {
            if (opt.disabled) {
              return false
            }
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
          <FormCheckbox
            label="Override sanction list result (I promise that I have manually checked the list)"
            name="overriden"
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

        {form.watch('type') !== ClaimPaymentType.Automatic &&
          form.watch('type') !== undefined && (
            <TextDatePicker
              style={{ marginBottom: '2rem' }}
              placeholder="Payment performed"
              value={date}
              onChange={setDate}
            />
          )}

        <div>
          <SubmitButton>Create payment</SubmitButton>
        </div>

        {isConfirming && (
          <PaymentConfirmationModal
            onClose={() => {
              setIsConfirming(false)
              clearFormHandler()
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
