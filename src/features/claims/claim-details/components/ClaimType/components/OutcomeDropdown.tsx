import { Placeholder, SemanticDropdown } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import React from 'react'
import { useSetClaimFlagMutation } from 'types/generated/graphql'

enum ClaimFlags {
  CONFIRMED_FRAUD = 'CONFIRMED_FRAUD',
  DUPLICATE = 'DUPLICATE',
  NOT_COVERED = 'NOT_COVERED',
  TEST = 'TEST',
}

export const OutcomeDropdown: React.FC<{
  claimId: string
  flags: string[]
}> = ({ claimId, flags }) => {
  const [setClaimFlag] = useSetClaimFlagMutation()

  const handleSelectOutcome = async (value: string) => {
    const previousFlag = flags.length ? flags[0] : null

    if (previousFlag) {
      await setClaimFlag({
        variables: { id: claimId, flag: previousFlag, flagValue: false },
        optimisticResponse: {
          setClaimFlag: {
            id: claimId,
            __typename: 'Claim',
            flags: value === 'not_specified' ? [] : [value],
          },
        },
      })
    }

    if (value === 'not_specified') {
      return
    }

    await setClaimFlag({
      variables: {
        id: claimId,
        flag: value,
        flagValue: true,
      },
      optimisticResponse: {
        setClaimFlag: {
          id: claimId,
          __typename: 'Claim',
          flags: [value],
        },
      },
    })
  }

  return (
    <SemanticDropdown
      options={[
        ...Object.keys(ClaimFlags).map((flag) => ({
          value: flag,
          text: convertEnumToTitle(flag),
        })),
        { value: 'not_specified', text: 'Not specified' },
      ]}
      onChange={handleSelectOutcome}
      value={flags.length ? flags[0] : 'not_specified'}
      onRender={() =>
        !!flags.length ? (
          <>{convertEnumToTitle(flags[0])}</>
        ) : (
          <Placeholder>Not specified</Placeholder>
        )
      }
    />
  )
}
