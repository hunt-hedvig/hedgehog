import { Dropdown, DropdownOption } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  ClaimState,
  useClaimOutcomeQuery,
  useSetClaimOutcomeMutation,
} from 'types/generated/graphql'
import gql from 'graphql-tag'
import { PushUserAction } from 'portals/hope/features/tracking/utils/tags'

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

gql`
  query ClaimOutcome($claimId: ID!) {
    claim(id: $claimId) {
      id
      outcome
      state
    }
  }

  mutation SetClaimOutcome($id: ID!, $outcome: String) {
    setClaimOutcome(id: $id, outcome: $outcome) {
      id
      outcome
    }
  }
`

interface UseClaimOutcomeResult {
  outcome: string | null
  setOutcome: (outcome: string | null) => void
}

const useClaimOutcome = (claimId: string): UseClaimOutcomeResult => {
  const [setClaimOutcome] = useSetClaimOutcomeMutation()
  const { data } = useClaimOutcomeQuery({ variables: { claimId } })

  const outcome = data?.claim?.outcome ?? null
  const state = data?.claim?.state ?? null

  const setOutcome = (newOutcome: string | null) => {
    if (state === ClaimState.Closed && outcome !== null) {
      toast.error('This claim is closed')
      return
    }

    if (!claimId) {
      return
    }

    PushUserAction('claim', 'set', 'outcome', newOutcome)

    setClaimOutcome({
      variables: { id: claimId, outcome: newOutcome },
      optimisticResponse: {
        setClaimOutcome: {
          __typename: 'Claim',
          id: claimId,
          outcome: newOutcome,
        },
      },
    })
  }

  return {
    outcome,
    setOutcome,
  }
}

export const ClaimOutcomeDropdown: React.FC<{
  claimId: string
}> = ({ claimId, ...props }) => {
  const { outcome, setOutcome } = useClaimOutcome(claimId)

  const options = [
    ...Object.keys(ClaimOutcomes).map((value) => ({
      value,
      text: convertEnumToTitle(value),
    })),
    { value: 'not_specified', text: 'Not specified' },
  ]

  return (
    <Dropdown placeholder="Not specified" {...props}>
      {options.map((option) => {
        const selected =
          outcome === option.value ||
          (outcome === null && option.value === 'not_specified' && false)

        return (
          <DropdownOption
            key={option.value}
            onClick={() =>
              setOutcome(option.value === 'not_specified' ? null : option.value)
            }
            selected={selected}
          >
            {option.text}
          </DropdownOption>
        )
      })}
    </Dropdown>
  )
}
