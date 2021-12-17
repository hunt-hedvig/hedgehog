import { Keys, NumberKeys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useCommandLine } from 'features/commands/use-command-line'
import { getMemberFlag } from 'features/member/utils'
import {
  EmptyState,
  MemberHistoryCardWrapper,
  MemberHistoryWrapper,
  MemberId,
  MemberName,
} from 'features/members-search/styles'
import { useMemberHistory } from 'features/user/hooks/use-member-history'
import React from 'react'
import { useHistory } from 'react-router'
import { useMemberNameAndContractMarketInfoQuery } from 'types/generated/graphql'

export const MemberSuggestions: React.FC = () => {
  const { memberHistory } = useMemberHistory()

  return (
    <MemberHistoryWrapper>
      {memberHistory.length === 0 && (
        <EmptyState>No suggested members yet</EmptyState>
      )}

      {memberHistory.map((memberId, index) => (
        <MemberHistoryCard
          key={memberId}
          memberId={memberId}
          orderNumber={index + 1}
        />
      ))}
    </MemberHistoryWrapper>
  )
}

const MemberHistoryCard: React.FC<{
  memberId: string
  orderNumber: number
}> = ({ memberId, orderNumber }) => {
  const { data } = useMemberNameAndContractMarketInfoQuery({
    variables: { memberId },
  })

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
    <MemberHistoryCardWrapper muted={!data?.member} to={targetLocation}>
      <MemberName>
        {data?.member?.firstName} {data?.member?.lastName}&nbsp;
        {getMemberFlag(
          data?.member?.contractMarketInfo,
          data?.member?.pickedLocale,
        )}
        {isHintingControl && <>({orderNumber})</>}
      </MemberName>
      <MemberId>{memberId}</MemberId>
    </MemberHistoryCardWrapper>
  )
}
