import { Placeholder, SemanticDropdown } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import React from 'react'
import { toast } from 'react-hot-toast'
import { ClaimState, useSetClaimOutcomeMutation } from 'types/generated/graphql'

enum ClaimOutcomes {
  CONFIRMED_FRAUD = 'CONFIRMED_FRAUD',
  COMPENSATION_BELOW_DEDUCTIBLE = 'COMPENSATION_BELOW_DEDUCTIBLE',
  NOT_COVERED_BY_TERMS = 'NOT_COVERED_BY_TERMS',
  PAID = 'PAID',
  DUPLICATE = 'DUPLICATE',
  TEST = 'TEST',
}

export const OutcomeDropdown: React.FC<{
  claimState: string
  claimId: string
  outcome: string | null
}> = ({ claimState, claimId, outcome }) => {
  const [setClaimOutcome] = useSetClaimOutcomeMutation()

  const handleSelectOutcome = async (newOutcome: string | null) => {
    if (claimState === ClaimState.Closed) {
      toast.error('This claim is closed')
      return
    }

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

  return (
    <SemanticDropdown
      options={[
        ...Object.keys(ClaimOutcomes).map((value) => ({
          value,
          text: convertEnumToTitle(value),
        })),
        { value: 'not_specified', text: 'Not specified' },
      ]}
      onChange={(value) =>
        handleSelectOutcome(value === 'not_specified' ? null : value)
      }
      value={outcome ?? 'not_specified'}
      onRender={() =>
        outcome ? (
          <>{convertEnumToTitle(outcome)}</>
        ) : (
          <Placeholder>Not specified</Placeholder>
        )
      }
    />
  )
}
