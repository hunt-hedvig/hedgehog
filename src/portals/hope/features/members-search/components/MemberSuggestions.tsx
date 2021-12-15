import { useArrowKeyboardNavigation } from '@hedvig-ui/hooks/keyboard/use-arrow-keyboard-navigation'
import { Keys, NumberKeys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useCommandLine } from 'portals/hope/features/commands/use-command-line'
import { getMemberFlag } from 'portals/hope/features/member/utils'
import {
  EmptyState,
  MemberHistoryCardWrapper,
  MemberHistoryWrapper,
  MemberId,
  MemberName,
} from 'portals/hope/features/members-search/styles'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { useMemberNameAndContractMarketInfoQuery } from 'types/generated/graphql'

export const MemberSuggestions: React.FC<{
  navigationAvailable: boolean
  memberHistory: readonly string[]
}> = ({ navigationAvailable, memberHistory }) => {
  const history = useHistory()

  const [navigationStep, reset] = useArrowKeyboardNavigation({
    maxStep: memberHistory.length - 2,
    isActive: navigationAvailable && !!memberHistory.length,
    direction: 'horizontal',
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
          focus={navigationAvailable && navigationStep === index - 1}
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
  focus: boolean
}> = ({ memberId, orderNumber, focus }) => {
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
    <MemberHistoryCardWrapper
      muted={!data?.member}
      to={targetLocation}
      focus={focus}
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
