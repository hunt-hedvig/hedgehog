import { Keys, NumberKeys } from '@hedvig-ui'
import { useCommandLine } from 'portals/hope/features/commands/use-command-line'
import { getMemberFlag } from 'portals/hope/features/member/utils'
import {
  EmptyState,
  MemberHistoryCardWrapper,
  MemberHistoryWrapper,
  MemberId,
  MemberName,
} from 'portals/hope/features/members-search/styles'
import React from 'react'
import { useHistory } from 'react-router'
import { useNavigation } from '@hedvig-ui'
import { useMemberNameAndContractMarketInfoQuery } from 'types/generated/graphql'
import { PickedLocale } from 'portals/hope/features/config/constants'
import gql from 'graphql-tag'

gql`
  query MemberNameAndContractMarketInfo($memberId: ID!) {
    member(id: $memberId) {
      memberId
      firstName
      lastName
      contractMarketInfo {
        market
      }
      pickedLocale
    }
  }
`

export const MemberSuggestions: React.FC<{
  suggestions: ReadonlyArray<string>
}> = ({ suggestions }) => {
  return (
    <MemberHistoryWrapper>
      {suggestions.length === 0 && (
        <EmptyState>No suggested members yet</EmptyState>
      )}

      {suggestions.map((memberId, index) => (
        <MemberHistoryCard
          key={memberId}
          memberId={memberId}
          orderNumber={index + 1}
          suggestionsCount={suggestions.length}
        />
      ))}
    </MemberHistoryWrapper>
  )
}

const MemberHistoryCard: React.FC<{
  memberId: string
  orderNumber: number
  suggestionsCount: number
}> = ({ memberId, orderNumber, suggestionsCount }) => {
  const { data } = useMemberNameAndContractMarketInfoQuery({
    variables: { memberId },
  })

  const { register } = useNavigation()

  const { registerActions, isHintingControl } = useCommandLine()
  const history = useHistory()
  const targetLocation = `/members/${memberId}`

  registerActions([
    {
      label: `Navigate to ${data?.member?.firstName} ${data?.member?.lastName} (${memberId})`,
      keys: [Keys.Control, NumberKeys[orderNumber]],
      onResolve: () => history.push(targetLocation),
    },
  ])

  return (
    <MemberHistoryCardWrapper
      muted={!data?.member}
      to={targetLocation}
      {...register(`Member Suggestion ${orderNumber}`, {
        resolve: () => {
          history.push(targetLocation)
        },
        neighbors: {
          up: 'Member Search Form',
          left: `Member Suggestion ${orderNumber - 1}`,
          right:
            orderNumber <= suggestionsCount
              ? `Member Suggestion ${orderNumber + 1}`
              : undefined,
        },
      })}
    >
      <MemberName>
        {data?.member?.firstName} {data?.member?.lastName}&nbsp;
        {getMemberFlag(
          data?.member?.contractMarketInfo,
          data?.member?.pickedLocale as PickedLocale | null | undefined,
        )}
        {isHintingControl && <>({orderNumber})</>}
      </MemberName>
      <MemberId>{memberId}</MemberId>
    </MemberHistoryCardWrapper>
  )
}
