import { Placeholder, SemanticDropdown } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import React from 'react'
import { useSetClaimOutcomeMutation } from 'types/generated/graphql'

enum ClaimOutcomes {
  CONFIRMED_FRAUD = 'CONFIRMED_FRAUD',
  DUPLICATE = 'DUPLICATE',
  NOT_COVERED = 'NOT_COVERED',
  TEST = 'TEST',
}

export const OutcomeDropdown: React.FC<{
  claimId: string
  outcome: string | null
}> = ({ claimId, outcome }) => {
  const [setClaimOutcome] = useSetClaimOutcomeMutation()

  const handleSelectOutcome = async (newOutcome: string | null) => {
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
