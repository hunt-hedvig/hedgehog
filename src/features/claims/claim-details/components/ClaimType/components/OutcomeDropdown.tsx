import { Dropdown, Placeholder } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  useResetClaimFlagsMutation,
  useSetClaimFlagMutation,
} from 'types/generated/graphql'

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
  const [resetClaimFlags] = useResetClaimFlagsMutation()

  const handleSelectOutcome = (value: string) => {
    if (value === 'not_specified') {
      resetClaimFlags({
        variables: { id: claimId },
        optimisticResponse: {
          resetClaimFlags: {
            id: claimId,
            __typename: 'Claim',
            flags: [],
          },
        },
      })
      return
    }

    toast.promise(
      resetClaimFlags({
        variables: { id: claimId },
        optimisticResponse: {
          resetClaimFlags: {
            id: claimId,
            __typename: 'Claim',
            flags: [value],
          },
        },
      }).then(() =>
        setClaimFlag({
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
        }),
      ),
      {
        loading: 'Updating outcome',
        success: 'Outcome updated',
        error: 'Could not update outcome',
      },
    )
  }

  return (
    <Dropdown
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
