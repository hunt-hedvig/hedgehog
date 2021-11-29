import { useArrowKeyboardNavigation } from '@hedvig-ui/hooks/keyboard/use-arrow-keyboard-navigation'
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
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { useMemberNameAndContractMarketInfoQuery } from 'types/generated/graphql'

export const MemberSuggestions: React.FC<{ navigationAvailable: boolean }> = ({
  navigationAvailable,
}) => {
  const { memberHistory } = useMemberHistory()

  const history = useHistory()

  const [navigationStep, reset] = useArrowKeyboardNavigation({
    maxStep: memberHistory.length - 2,
    isActive: navigationAvailable && !!memberHistory.length,
    vertical: false,
    withNegative: true,
    onPerformNavigation: (index) => {
      history.push(`/members/${memberHistory[index + 1]}`)
    },
  })

  useEffect(() => {
    if (!navigationAvailable) {
      reset()
    }
  }, [navigationAvailable])

  return (
    <MemberHistoryWrapper>
      {memberHistory.length === 0 && (
        <EmptyState>No suggested members yet</EmptyState>
      )}

      {memberHistory.map((memberId, index) => (
        <MemberHistoryCard
          active={navigationAvailable && index === navigationStep + 1}
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
  active: boolean
}> = ({ memberId, orderNumber, active }) => {
  const { data } = useMemberNameAndContractMarketInfoQuery({
    variables: { memberId },
  })

  const { registerActions, isHintingControl } = useCommandLine()
  const history = useHistory()
  const targetLocation = registerActions([
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
      active={active}
    >
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
