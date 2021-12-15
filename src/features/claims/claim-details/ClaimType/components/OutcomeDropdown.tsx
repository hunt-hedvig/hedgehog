import { Dropdown, DropdownOption } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import React from 'react'
import { toast } from 'react-hot-toast'
import { ClaimState, useSetClaimOutcomeMutation } from 'types/generated/graphql'

export enum ClaimOutcomes {
  PAID_OUT = 'PAID_OUT',
  NOT_COVERED_BY_TERMS = 'NOT_COVERED_BY_TERMS',
  COMPENSATION_BELOW_DEDUCTIBLE = 'COMPENSATION_BELOW_DEDUCTIBLE',
  RETRACTED_BY_MEMBER = 'RETRACTED_BY_MEMBER',
  RETRACTED_BY_HEDVIG = 'RETRACTED_BY_HEDVIG',
  COVERED_BY_OTHER_INSURANCE_COMPANY = 'COVERED_BY_OTHER_INSURANCE_COMPANY',
  UNRESPONSIVE = 'UNRESPONSIVE',
  CONFIRMED_FRAUD = 'CONFIRMED_FRAUD',
  DUPLICATE = 'DUPLICATE',
  OTHER = 'OTHER',
  TEST = 'TEST',
}

interface OutcomeDropdownProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  claimState?: string
  claimId?: string
  outcome: string | null
  onSelect?: (value: string | null) => void
  focus?: boolean
}

export const OutcomeDropdown: React.FC<OutcomeDropdownProps> = ({
  claimState,
  claimId,
  outcome,
  onSelect,
  focus,
  ...props
}) => {
  const [setClaimOutcome] = useSetClaimOutcomeMutation()

  const handleSelectOutcome = async (newOutcome: string | null) => {
    if (!claimState && !claimId && onSelect) {
      onSelect(newOutcome)
      return
    }

    if (claimState === ClaimState.Closed) {
      toast.error('This claim is closed')
      return
    }

    if (claimId) {
      await setClaimOutcome({
        variables: { id: claimId, outcome: newOutcome },
        optimisticResponse: {
          setClaimOutcome: {
            id: claimId,
            __typename: 'Claim',
            outcome: newOutcome,
          },
        },
      })
    }
  }

  return (
    <Dropdown placeholder="Not specified" focus={focus} {...props}>
      {[
        ...Object.keys(ClaimOutcomes).map((value) => ({
          value,
          text: convertEnumToTitle(value),
        })),
        { value: 'not_specified', text: 'Not specified' },
      ].map((opt) => (
        <DropdownOption
          key={opt.value}
          onClick={() => {
            handleSelectOutcome(
              opt.value === 'not_specified' ? null : opt.value,
            )
          }}
          selected={
            outcome === opt.value ||
            (outcome === null && opt.value === 'not_specified' && false)
          }
        >
          {opt.text}
        </DropdownOption>
      ))}
    </Dropdown>
  )
}
