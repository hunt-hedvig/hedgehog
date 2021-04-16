import { useMemberNameAndContractMarketInfoQuery } from 'api/generated/graphql'
import {
  EmptyState,
  MemberHistoryCardWrapper,
  MemberHistoryWrapper,
  MemberId,
  MemberName,
} from 'components/members-search/styles'
import React, { useContext } from 'react'
import { useHistory } from 'react-router'
import { useCommandLine } from 'utils/hooks/command-line-hook'
import { Keys, NumberKeys } from 'utils/hooks/key-press-hook'
import { MemberHistoryContext } from 'utils/member-history'
import { MemberFlag } from '../../member/shared/member-flag'

export const MemberSuggestions: React.FC = () => {
  const { memberHistory } = useContext(MemberHistoryContext)

  return (
    <MemberHistoryWrapper>
      {memberHistory.length === 0 && (
        <EmptyState>No suggested members yet</EmptyState>
      )}

      {memberHistory.map((memberId, index) => (
        <MemberHistoryCard key={memberId} memberId={memberId} index={index} />
      ))}
    </MemberHistoryWrapper>
  )
}

const MemberHistoryCard: React.FC<{ memberId: string; index: number }> = ({
  memberId,
  index,
}) => {
  const { data } = useMemberNameAndContractMarketInfoQuery({
    variables: { memberId },
  })

  const { registerActions, isHintingControl } = useCommandLine()
  const history = useHistory()
  const targetLocation = `/members/${memberId}`
  registerActions([
    {
      label: `Navigate to ${data?.member?.firstName} ${data?.member?.lastName} (${memberId})`,
      keys: [Keys.Control, NumberKeys[index + 1]],
      onResolve: () => history.push(targetLocation),
    },
  ])
  return (
    <MemberHistoryCardWrapper muted={!data?.member} to={targetLocation}>
      <MemberName>
        {data?.member?.firstName} {data?.member?.lastName}&nbsp;
        <MemberFlag memberId={memberId} />
        {isHintingControl && <>({index + 1})</>}
      </MemberName>
      <MemberId>{memberId}</MemberId>
    </MemberHistoryCardWrapper>
  )
}
