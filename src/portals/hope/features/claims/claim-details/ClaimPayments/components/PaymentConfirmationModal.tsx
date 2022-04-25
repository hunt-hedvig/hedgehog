import styled from '@emotion/styled'
import { Button, ButtonsGroup, Checkbox, Input, Modal } from '@hedvig-ui'
import { Market } from 'portals/hope/features/config/constants'
import React, { useState } from 'react'
import { FieldValues, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import {
  ClaimPaymentInput,
  ClaimPaymentType,
  ClaimSwishPaymentInput,
  useCreateClaimPaymentMutation,
  Claim,
  useCreateSwishClaimPaymentMutation,
  ClaimState,
} from 'types/generated/graphql'
import { useClaimStatus } from '../../ClaimInformation/components/ClaimStatusDropdown'

const Explanation = styled.p`
  margin-top: 2em;
  font-size: 0.9em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const CloseClaimCheckbox = styled(Checkbox)`
  margin-left: auto;
`

interface PaymentConfirmationModalProps {
  onClose: () => void
  identified: boolean
  market?: string | null
  values: FieldValues & {
    exGratia: boolean
  }
  claim: Claim
  isOverridden: boolean
  date: string | null
  claimId: string
  confirmSuccess: () => void
  visible: boolean
}

export const PaymentConfirmationModal: React.FC<
  PaymentConfirmationModalProps
> = ({
  onClose,
  identified,
  market,
  values: { type, amount, deductible, note, phoneNumber, message, exGratia },
  isOverridden,
  claim,
  date,
  claimId,
  confirmSuccess,
  visible,
}) => {
  const [closeClaim, setCloseClaim] = useState(false)
  const [createPayment] = useCreateClaimPaymentMutation()
  const [createSwishPayment] = useCreateSwishClaimPaymentMutation()

  const { status: claimStatus, setStatus: changeClaimStatus } =
    useClaimStatus(claimId)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<{ confirmation: string }>()

  const submitHandler = async ({ confirmation }: { confirmation: string }) => {
    if (confirmation !== amount) {
      toast.error('Confirmation failed')
      return
    }

    const paymentInput: Partial<ClaimPaymentInput | ClaimSwishPaymentInput> = {
      amount: {
        amount: +amount,
        currency: 'SEK',
      },
      deductible: {
        amount: +deductible,
        currency: 'SEK',
      },
      sanctionListSkipped: Boolean(isOverridden),
      note: note,
      exGratia: exGratia,
      carrier: claim?.agreement?.carrier ?? 'HEDVIG',
      paidAt:
        type !== ClaimPaymentType.Automatic && date
          ? `${date}T00:00:00.000Z`
          : null,
    }

    if (type === 'AutomaticSwish') {
      await toast.promise(
        createSwishPayment({
          variables: {
            id: claimId,
            payment: {
              ...(paymentInput as ClaimSwishPaymentInput),
              phoneNumber: phoneNumber,
              message: message,
            },
          },
        }),
        {
          loading: 'Creating Swish payment',
          success: () => {
            confirmSuccess()
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
              type: type as ClaimPaymentType,
            },
          },
        }),
        {
          loading: 'Creating payment',
          success: () => {
            confirmSuccess()
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
    <Modal
      visible={visible}
      style={{ padding: '1rem', width: 500 }}
      onClose={() => {
        onClose()
      }}
    >
      {!identified && market === Market.Norway && (
        <Explanation>
          ⚠️ Please note that this member is not identified
        </Explanation>
      )}
      <Explanation>
        To perform the payment, confirm it by entering "{amount}" below.
      </Explanation>
      <form onSubmit={handleSubmit(submitHandler)}>
        <Input
          autoFocus
          {...register('confirmation', { required: 'This field is required' })}
          name="confirmation"
          placeholder="Amount"
          errors={errors}
        />
        <ButtonsGroup style={{ marginTop: '1em' }}>
          <Button disabled={watch('confirmation') !== amount} type="submit">
            Confirm
          </Button>
          <Button
            variant="tertiary"
            style={{ marginLeft: '1.0em' }}
            onClick={() => {
              onClose()
            }}
          >
            Cancel
          </Button>
          {claimStatus !== ClaimState.Closed && (
            <CloseClaimCheckbox
              label="Also close the claim"
              checked={closeClaim}
              onChange={() => setCloseClaim((prev) => !prev)}
            />
          )}
        </ButtonsGroup>
      </form>
    </Modal>
  )
}
