import { Button, Checkbox, Input, Select, TextDatePicker } from '@hedvig-ui'
import styled from '@emotion/styled'
import { Market } from 'portals/hope/features/config/constants'
import React, { useEffect, useState } from 'react'
import {
  Claim,
  ClaimPayment,
  ClaimPaymentType,
  SanctionStatus,
  useMemberPaymentInformationQuery,
} from 'types/generated/graphql'
import { PaymentConfirmationModal } from './PaymentConfirmationModal'
import gql from 'graphql-tag'
import { PushUserAction } from 'portals/hope/features/tracking/utils/tags'
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form'

const areSwishPayoutsEnabled = () => {
  return (
    (
      window as Window &
        typeof global & { HOPE_FEATURES: { swishPayoutsEnabled?: boolean } }
    ).HOPE_FEATURES?.swishPayoutsEnabled ?? false
  )
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

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const ButtonsGroup = styled.div<{ isCorrection: boolean }>`
  margin-top: 1rem;

  display: grid;
  grid-template-columns: ${({ isCorrection }) =>
    isCorrection ? '10rem 10rem' : '10rem'};
  gap: 1rem;
`

export const ClaimPaymentForm: React.FC<{
  claimId: string
  selectedPayment: ClaimPayment | null
  clearSelection: () => void
}> = ({ claimId, selectedPayment, clearSelection }) => {
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
    watch,
    formState: { errors },
    setValue,
    getValues,
    reset,
  } = useForm<{
    type: ClaimPaymentType | 'AutomaticSwish'
    amount: string
    deductible: string
    note: string
    phoneNumber?: string
    message?: string
  }>()

  useEffect(() => {
    if (!selectedPayment) {
      return
    }

    setValue('amount', selectedPayment.amount.amount)
    setValue('deductible', selectedPayment.deductible.amount)
    setValue('note', selectedPayment.note)
    setValue('type', selectedPayment.type)
    setExGratia(selectedPayment.exGratia)

    if (
      selectedPayment.type !== ClaimPaymentType.Automatic &&
      selectedPayment.paidAt
    ) {
      setDate(selectedPayment.paidAt)
    }

    // if (selectedPayment.phoneNumber && selectedPayment.message) {
    //   setValue('phoneNumber', selectedPayment.phoneNumber)
    //   setValue('message', selectedPayment.message)
    // }
  }, [selectedPayment])

  useEffect(() => {
    if (exGratia && getValues().type === ClaimPaymentType.Automatic) {
      setValue('type', ClaimPaymentType.Expense)
    }
  }, [exGratia])

  const claim = data?.claim
  const member = data?.claim?.member

  const isPaymentActivated =
    !!member?.directDebitStatus?.activated ||
    !!member?.payoutMethodStatus?.activated

  if (
    !data?.claim?.contract &&
    !data?.claim?.agreement?.carrier &&
    !data?.claim?.trial
  ) {
    return null
  }

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

  const submitHandler: SubmitHandler<FieldValues> = (values: FieldValues) => {
    setConfirmationData(values)
  }

  const correctionCancelHandler = () => {
    clearSelection()
    clearFormHandler()
  }

  const confirmSuccess = () => {
    PushUserAction('claim', 'create', 'payment', null)
    clearFormHandler()
  }

  return (
    <Form onSubmit={handleSubmit(submitHandler)}>
      <Input
        {...register('amount', { required: 'Amount is required' })}
        placeholder="Payout amount"
        type="number"
        step="any"
        affix={{ content: 'SEK' }}
        errors={errors}
        label="Amount"
      />

      <Input
        {...register('deductible')}
        disabled={!!selectedPayment}
        placeholder="Deductible"
        label="Deductible"
        step="any"
        type="number"
      />

      <Input
        disabled={!!selectedPayment}
        placeholder="Note"
        {...register('note', { required: 'Note is required' })}
        errors={errors}
        label="Note"
      />

      <Checkbox
        label="Ex Gratia?"
        disabled={!!selectedPayment}
        name="exGratia"
        style={{ width: '8rem' }}
        checked={exGratia}
        onChange={() => setExGratia((prev) => !prev)}
      />

      <Select
        {...register('type')}
        placeholder="Type"
        label="Type"
        disabled={!!selectedPayment}
      >
        <option
          value={ClaimPaymentType.Automatic}
          hidden={exGratia}
          disabled={!isPaymentActivated}
        >
          {ClaimPaymentType.Automatic}
        </option>
        <option value={ClaimPaymentType.Expense}>
          {ClaimPaymentType.Expense}
        </option>
        <option value={ClaimPaymentType.IndemnityCost}>
          {ClaimPaymentType.IndemnityCost}
        </option>
        <option
          value="AutomaticSwish"
          hidden={
            areSwishPayoutsEnabled() &&
            member?.contractMarketInfo?.market === Market.Sweden &&
            !exGratia
              ? false
              : true
          }
        >
          AutomaticSwish
        </option>
        <option value={ClaimPaymentType.Manual} hidden={true} disabled={true}>
          {ClaimPaymentType.Manual}
        </option>
      </Select>

      {isPotentiallySanctioned ? (
        <Checkbox
          disabled={!!selectedPayment}
          style={{ width: '40rem' }}
          label="Override sanction list result (I promise that I have manually checked the list)"
          name="overriden"
          checked={isOverridden}
          onChange={() => setIsOverridden((prev) => !prev)}
        />
      ) : null}

      {watch('type') === 'AutomaticSwish' && !exGratia ? (
        <>
          <Input
            {...register('phoneNumber')}
            disabled={!!selectedPayment}
            placeholder="Phone number (467XXXXXXXX)"
          />
          <Input
            {...register('message')}
            disabled={!!selectedPayment}
            placeholder="Swish notification message"
          />
        </>
      ) : null}

      {watch('type') !== ClaimPaymentType.Automatic ? (
        <TextDatePicker
          disabled={!!selectedPayment}
          label="Paid at"
          placeholder="Payment performed"
          value={date}
          onChange={setDate}
        />
      ) : null}

      <ButtonsGroup isCorrection={!!selectedPayment}>
        <Button type="submit">
          {selectedPayment ? 'Make Correction' : 'Create payment'}
        </Button>
        {!!selectedPayment && (
          <Button
            type="button"
            variant="tertiary"
            onClick={correctionCancelHandler}
          >
            Cancel
          </Button>
        )}
      </ButtonsGroup>

      {member?.contractMarketInfo ? (
        <PaymentConfirmationModal
          visible={!!confirmationData}
          onClose={() => {
            setConfirmationData(null)
          }}
          identified={!!member.identity}
          market={member.contractMarketInfo.market}
          values={{ ...confirmationData, exGratia }}
          claim={claim as Claim}
          isOverridden={isOverridden}
          date={date}
          claimId={claimId}
          confirmSuccess={confirmSuccess}
          selectedId={selectedPayment?.id}
        />
      ) : null}
    </Form>
  )
}
