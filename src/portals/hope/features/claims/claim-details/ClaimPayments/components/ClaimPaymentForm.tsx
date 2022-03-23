import {
  Checkbox,
  TextDatePicker,
  Button,
  Input,
  FormDropdown,
} from '@hedvig-ui'
import { Market } from 'portals/hope/features/config/constants'
import React, { useEffect, useState } from 'react'
import { SubmitHandler, useForm, FieldValues } from 'react-hook-form'
import {
  ClaimPaymentType,
  SanctionStatus,
  useMemberPaymentInformationQuery,
  Claim,
} from 'types/generated/graphql'
import { PaymentConfirmationModal } from './PaymentConfirmationModal'
import gql from 'graphql-tag'
import { PushUserAction } from 'portals/hope/features/tracking/utils/tags'

const areSwishPayoutsEnabled = () => {
  return (
    (
      window as Window &
        typeof global & { HOPE_FEATURES: { swishPayoutsEnabled?: boolean } }
    ).HOPE_FEATURES?.swishPayoutsEnabled ?? false
  )
}

interface CategoryOptionsType {
  key: number
  value: string
  text: string
  disabled?: boolean
}

gql`
  mutation CreateClaimPayment($id: ID!, $payment: ClaimPaymentInput!) {
    createClaimPayment(id: $id, payment: $payment) {
      id
      ...ClaimPayments
    }
  }

  mutation CreateSwishClaimPayment(
    $id: ID!
    $payment: ClaimSwishPaymentInput!
  ) {
    createClaimSwishPayment(id: $id, payment: $payment) {
      id
      ...ClaimPayments
    }
  }

  query MemberPaymentInformation($claimId: ID!) {
    claim(id: $claimId) {
      agreement {
        id
        carrier
      }
      trial {
        id
      }
      contract {
        id
      }
      member {
        memberId
        sanctionStatus
        contractMarketInfo {
          market
          preferredCurrency
        }
        directDebitStatus {
          activated
        }
        payoutMethodStatus {
          activated
        }
        adyenShopperReference
        identity {
          nationalIdentification {
            identification
            nationality
          }
          firstName
          lastName
        }
        transactions {
          id
          amount {
            amount
            currency
          }
          timestamp
          type
          status
        }
      }
    }
  }
`

export const ClaimPaymentForm: React.FC<{
  claimId: string
}> = ({ claimId }) => {
  const { data } = useMemberPaymentInformationQuery({
    variables: { claimId },
  })

  const [exGratia, setExGratia] = useState(false)
  const [isOverridden, setIsOverridden] = useState(false)
  const [date, setDate] = useState<string | null>(null)
  const [confirmationData, setConfirmationData] = useState<FieldValues | null>(
    null,
  )

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    watch,
    reset,
    control,
  } = useForm<FieldValues>()

  const claim = data?.claim
  const member = data?.claim?.member

  const isPaymentActivated =
    !!member?.directDebitStatus?.activated ||
    !!member?.payoutMethodStatus?.activated

  useEffect(() => {
    if (exGratia && getValues().type === ClaimPaymentType.Automatic) {
      setValue('type', ClaimPaymentType.Expense)
    }
  }, [exGratia])

  if (
    !data?.claim?.contract &&
    !data?.claim?.agreement?.carrier &&
    !data?.claim?.trial
  ) {
    return null
  }

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

  const clearFormHandler = () => {
    setExGratia(false)
    setDate(null)
    setConfirmationData(null)
    reset()
    setValue('type', ClaimPaymentType.Automatic)
  }

  const isPotentiallySanctioned =
    member?.sanctionStatus === SanctionStatus.Undetermined ||
    member?.sanctionStatus === SanctionStatus.PartialHit

  const submitHandler: SubmitHandler<FieldValues> = async (
    values: FieldValues,
  ) => {
    setConfirmationData(values)
  }

  const confirmSuccess = () => {
    PushUserAction('claim', 'create', 'payment', null)
    clearFormHandler()
  }

  return (
    <form onSubmit={handleSubmit(submitHandler)}>
      <Input
        {...register('amount', { required: true })}
        placeholder="Payout amount"
        type="number"
        step="any"
        affix={{ content: 'SEK' }}
        error={errors.amount?.type === 'required'}
        errorText="First name is required"
        style={{ marginBottom: '1.5rem' }}
      />
      <Input
        {...register('deductible')}
        placeholder="Deductible"
        step="any"
        type="number"
        style={{ marginBottom: '1.5rem' }}
      />
      <Input
        {...register('note', { required: true })}
        placeholder="Note"
        error={errors.note?.type === 'required'}
        errorText="Note is required"
        style={{ marginBottom: '1.5rem' }}
      />
      <Checkbox
        label="Ex Gratia?"
        name="exGratia"
        style={{ width: '8rem', marginBottom: '1.5rem' }}
        checked={exGratia}
        onChange={() => setExGratia((prev) => !prev)}
      />

      {/* In that case, we need to use Controller,
          because Dropdown is an unusual field. */}
      <FormDropdown
        name="type"
        placeholder="Type"
        rules={{
          required: true,
        }}
        style={{ marginBottom: '1.5rem' }}
        defaultValue={ClaimPaymentType.Automatic}
        control={control}
        options={categoryOptions
          .filter((opt) => {
            if (opt.disabled) {
              return false
            }
            if (opt.value === 'AutomaticSwish') {
              return (
                areSwishPayoutsEnabled() &&
                member?.contractMarketInfo?.market === Market.Sweden &&
                !exGratia
              )
            }
            return exGratia ? opt.value !== ClaimPaymentType.Automatic : true
          })
          .map((opt) => ({ value: opt.value, text: opt.text, key: opt.key }))}
      />

      {isPotentiallySanctioned && (
        <Checkbox
          style={{ width: '40rem', marginBottom: '1.5rem' }}
          label="Override sanction list result (I promise that I have manually checked the list)"
          name="overriden"
          checked={isOverridden}
          onChange={() => setIsOverridden((prev) => !prev)}
        />
      )}

      {watch('type') === 'AutomaticSwish' && !exGratia && (
        <>
          <Input
            {...register('phoneNumber', { required: true })}
            placeholder="Phone number (467XXXXXXXX)"
            error={errors.phoneNumber?.type === 'required'}
            errorText="Phone number is required"
          />
          <Input
            {...register('message', { required: true })}
            placeholder="Swish notification message"
            error={errors.message?.type === 'required'}
            errorText="Phone number is required"
          />
        </>
      )}

      {watch('type') !== ClaimPaymentType.Automatic && (
        <TextDatePicker
          style={{ marginBottom: '2rem' }}
          placeholder="Payment performed"
          value={date}
          onChange={setDate}
        />
      )}

      <div>
        <Button type="submit">Create payment</Button>
      </div>

      {!!confirmationData && member?.contractMarketInfo && (
        <PaymentConfirmationModal
          onClose={() => {
            setConfirmationData(null)
            clearFormHandler()
          }}
          identified={!!member.identity}
          market={member.contractMarketInfo.market}
          values={{ ...confirmationData, exGratia }}
          claim={claim as Claim}
          isOverridden={isOverridden}
          date={date}
          claimId={claimId}
          confirmSuccess={confirmSuccess}
        />
      )}
    </form>
  )
}
