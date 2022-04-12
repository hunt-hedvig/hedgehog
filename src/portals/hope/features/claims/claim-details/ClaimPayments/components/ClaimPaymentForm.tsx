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
  ClaimState,
  ClaimSwishPaymentInput,
  SanctionStatus,
  useCreateClaimPaymentMutation,
  useCreateSwishClaimPaymentMutation,
  useMemberPaymentInformationQuery,
} from 'types/generated/graphql'
import { PaymentConfirmationModal } from './PaymentConfirmationModal'
import gql from 'graphql-tag'
import { PushUserAction } from 'portals/hope/features/tracking/utils/tags'
import { useNavigation } from '@hedvig-ui'
import { useClaimStatus } from '../../ClaimInformation/components/ClaimStatusDropdown'

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

  const [createPayment, { loading }] = useCreateClaimPaymentMutation()
  const [createSwishPayment] = useCreateSwishClaimPaymentMutation()

  const [isConfirming, setIsConfirming] = useState(false)
  const [isExGratia, setIsExGratia] = useState(false)
  const [isOverridden, setIsOverridden] = useState(false)
  const [date, setDate] = useState<string | null>(null)

  const form = useForm()

  const { register } = useNavigation()

  const claim = data?.claim
  const member = data?.claim?.member

  const { status: claimStatus, setStatus: changeClaimStatus } =
    useClaimStatus(claimId)

  const isPaymentActivated =
    !!member?.directDebitStatus?.activated ||
    !!member?.payoutMethodStatus?.activated

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
    member?.sanctionStatus === SanctionStatus.Undetermined ||
    member?.sanctionStatus === SanctionStatus.PartialHit

  const createPaymentHandler = async (closeClaim: boolean) => {
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
      carrier: claim?.agreement?.carrier ?? 'HEDVIG',
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
            PushUserAction('claim', 'create', 'payment', null)
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

    if (closeClaim) {
      changeClaimStatus(ClaimState.Closed)
    }
  }

  return (
    <FormProvider {...form}>
      <Form onSubmit={() => setIsConfirming(true)}>
        <FormInput
          {...register('Claim Payments Payout')}
          placeholder="Payout amount"
          name="amount"
          defaultValue=""
          type="number"
          step="any"
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
          step="any"
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
                member?.contractMarketInfo?.market === Market.Sweden &&
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
            style={{ width: '40rem', marginBottom: '1.5rem' }}
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

        {member?.contractMarketInfo && (
          <PaymentConfirmationModal
            visible={isConfirming}
            onClose={() => {
              setIsConfirming(false)
              clearFormHandler()
            }}
            isClaimClosed={claimStatus === ClaimState.Closed}
            onSubmit={createPaymentHandler}
            amount={form.getValues().amount}
            identified={!!member.identity}
            market={member.contractMarketInfo.market}
          />
        )}
      </Form>
    </FormProvider>
  )
}
