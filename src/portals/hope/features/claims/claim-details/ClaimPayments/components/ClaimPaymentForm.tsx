import { Checkbox, TextDatePicker, Button } from '@hedvig-ui'
import { Market } from 'portals/hope/features/config/constants'
import React, { useEffect, useState } from 'react'
import {
  ClaimPaymentType,
  SanctionStatus,
  useMemberPaymentInformationQuery,
  Claim,
} from 'types/generated/graphql'
import { PaymentConfirmationModal } from './PaymentConfirmationModal'
import gql from 'graphql-tag'
import { PushUserAction } from 'portals/hope/features/tracking/utils/tags'
import {
  useForm,
  FormProvider,
  FieldValues,
  SubmitHandler,
} from 'react-hook-form'
import { Form, FormInput, FormSelect } from '@hedvig-ui/Form/testForm'

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
  const form = useForm()

  const { data } = useMemberPaymentInformationQuery({
    variables: { claimId },
  })

  const [exGratia, setExGratia] = useState(false)
  const [isOverridden, setIsOverridden] = useState(false)
  const [date, setDate] = useState<string | null>(null)
  const [confirmationData, setConfirmationData] = useState<FieldValues | null>(
    null,
  )

  const claim = data?.claim
  const member = data?.claim?.member

  const isPaymentActivated =
    !!member?.directDebitStatus?.activated ||
    !!member?.payoutMethodStatus?.activated

  useEffect(() => {
    if (exGratia && form.getValues().type === ClaimPaymentType.Automatic) {
      form.setValue('type', ClaimPaymentType.Expense)
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
    form.reset()
    form.setValue('type', ClaimPaymentType.Automatic)
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
    <FormProvider {...form}>
      <Form onSubmit={submitHandler}>
        <FormInput
          name="amount"
          placeholder="Payout amount"
          type="number"
          step="any"
          affix={{ content: 'SEK' }}
          required
        />
        <FormInput
          name="deductible"
          placeholder="Deductible"
          step="any"
          type="number"
        />
        <FormInput name="note" placeholder="Note" required />
        <Checkbox
          label="Ex Gratia?"
          name="exGratia"
          style={{ width: '8rem' }}
          checked={exGratia}
          onChange={() => setExGratia((prev) => !prev)}
        />

        <FormSelect
          name="type"
          placeholder="Type"
          defaultValue={ClaimPaymentType.Automatic}
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

        {isPotentiallySanctioned ? (
          <Checkbox
            style={{ width: '40rem' }}
            label="Override sanction list result (I promise that I have manually checked the list)"
            name="overriden"
            checked={isOverridden}
            onChange={() => setIsOverridden((prev) => !prev)}
          />
        ) : null}

        {form.watch('type') === 'AutomaticSwish' && !exGratia ? (
          <>
            <FormInput
              name="phoneNumber"
              placeholder="Phone number (467XXXXXXXX)"
            />
            <FormInput
              name="message"
              placeholder="Swish notification message"
            />
          </>
        ) : null}

        {form.watch('type') !== ClaimPaymentType.Automatic ? (
          <TextDatePicker
            placeholder="Payment performed"
            value={date}
            onChange={setDate}
          />
        ) : null}

        <div>
          <Button type="submit">Create payment</Button>
        </div>

        {member?.contractMarketInfo ? (
          <PaymentConfirmationModal
            visible={!!confirmationData}
            onClose={() => {
              setConfirmationData(null)
            }}
            clearForm={clearFormHandler}
            identified={!!member.identity}
            market={member.contractMarketInfo.market}
            values={{ ...confirmationData, exGratia }}
            claim={claim as Claim}
            isOverridden={isOverridden}
            date={date}
            claimId={claimId}
            confirmSuccess={confirmSuccess}
          />
        ) : null}
      </Form>
    </FormProvider>
  )
}
