import { useCommandLine } from '@hedvig-ui/utils/command-line-hook'
import { Keys, NumberKeys } from '@hedvig-ui/utils/key-press-hook'
import {
  EmptyState,
  MemberHistoryCardWrapper,
  MemberHistoryWrapper,
  MemberId,
  MemberName,
} from 'features/members-search/styles'
import React, { useContext } from 'react'
import { useHistory } from 'react-router'
import { useMemberNameAndContractMarketInfoQuery } from 'types/generated/graphql'
import { getMemberFlag } from 'utils/member'
import { MemberHistoryContext } from 'utils/member-history'

export const MemberSuggestions: React.FC = () => {
  const { memberHistory } = useContext(MemberHistoryContext)

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
