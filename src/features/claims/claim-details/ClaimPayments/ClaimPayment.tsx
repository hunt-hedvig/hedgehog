import styled from '@emotion/styled'
import {
  Checkbox,
  Form,
  FormDropdown,
  FormInput,
  SubmitButton,
  TextDatePicker,
} from '@hedvig-ui'
import { Market } from 'features/config/constants'
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
  focus: boolean
  sanctionStatus?: SanctionStatus | null
  claimId: string
  identified: boolean
  market: string
  carrier: string
  memberId: string
}> = ({
  focus,
  sanctionStatus,
  carrier,
  claimId,
  identified,
  market,
  memberId,
}) => {
  const { data: memberData, loading } = useGetMemberTransactionsQuery({
    variables: { id: memberId },
  })
  const [createPayment] = useCreateClaimPaymentMutation()
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
        (paymentType === ClaimPaymentType.Automatic && !isPaymentActivated),
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
    form.setValue(
      'type',
      isPaymentActivated
        ? ClaimPaymentType.Automatic
        : ClaimPaymentType.IndemnityCost,
    )
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
  }, [isExGratia, isPaymentActivated])

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
      timestamp: date,
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

  const setDateHandler = (newDate: Date | null) => {
    if (!newDate) {
      return
    }

    const dateString = new Date(newDate.setHours(newDate.getHours() + 2))
      .toISOString()
      .split('T')[0]

    setDate(dateString)
  }

  return (
    <FormProvider {...form}>
      <Form onSubmit={() => setIsConfirming(true)}>
        <FormInput
          focus={focus}
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
        {!loading && (
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
              return isExGratia
                ? opt.value !== ClaimPaymentType.Automatic
                : true
            })}
            name="type"
            defaultValue={
              isPaymentActivated
                ? ClaimPaymentType.Automatic
                : ClaimPaymentType.IndemnityCost
            }
            rules={{
              required: 'Category is required',
            }}
          />
        )}

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

        <TextDatePicker
          style={{ marginBottom: '2rem' }}
          placeholder={`Payment performed (${new Date().toDateString()})`}
          value={date ? new Date(date) : null}
          onChange={setDateHandler}
        />

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
