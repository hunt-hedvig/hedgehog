import styled from '@emotion/styled'
import { Capitalized, Flex, Tabs } from '@hedvig-ui'
import { memberPagePanes } from 'portals/hope/features/member/tabs'
import { FraudulentStatus } from 'portals/hope/features/member/tabs/member-tab/FraudulentStatus'
import {
  getMemberFlag,
  getMemberGroupName,
  getMemberIdColor,
  MemberAge,
} from 'portals/hope/features/member/utils'
import React, { useEffect } from 'react'
import { MemberDetails } from './MemberDetails'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import { useMemberHistory } from 'portals/hope/features/user/hooks/use-member-history'
import { PickedLocale } from 'portals/hope/features/config/constants'
import { useGetMemberInfo } from 'portals/hope/features/member/tabs/member-tab/hooks/use-get-member-info'
import { useTitle } from '@hedvig-ui/hooks/use-title'

const MemberPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: calc(100% - 400px);
  min-width: 700px;
  height: 100%;
  white-space: nowrap;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  font-size: 32px;
`

const Badge = styled('div')<{ memberId: string; numberMemberGroups: number }>`
  float: right;
  display: inline-flex;
  padding: 0.5rem 1rem;
  line-height: 1;
  font-size: 1rem;
  ${({ memberId, numberMemberGroups }) =>
    `background: ${getMemberIdColor(memberId, numberMemberGroups)}`};
  border-radius: 8px;
  color: #fff;
  margin-left: auto;
  margin-right: 1rem;
`

const Flag = styled('div')`
  display: inline-flex;
  font-size: 3rem;
  margin-left: 0.5rem;
`

export const MemberTabs: React.FC<{
  memberId: string
  tab: string
  onChangeTab: (newTab: string) => void
}> = ({ memberId, tab, onChangeTab }) => {
  const [member] = useGetMemberInfo(memberId)
  const { pushToMemberHistory } = useMemberHistory()
  const { numberMemberGroups } = useNumberMemberGroups()
  const panes = memberPagePanes(memberId)

  useTitle(member ? `${member?.firstName} ${member?.lastName}` : 'Loading...')
  useEffect(() => pushToMemberHistory(memberId), [])

  if (!member) {
    return null
  }

  const Pane = panes.find((pane) => pane.tabName === tab)?.component()

  return (
    <Flex>
      <MemberPageContainer>
        <Header>
          <FraudulentStatus
            stateInfo={{
              state: member.fraudulentStatus,
              description: member.fraudulentStatusDescription,
            }}
          />
          <Capitalized style={{ marginRight: 8 }}>
            {member.firstName || ''}
          </Capitalized>
          <Capitalized style={{ marginRight: 8 }}>
            {member.lastName || ''}
          </Capitalized>
          (<MemberAge birthDateString={member?.birthDate} />)
          {member && (
            <>
              <Flag>
                {getMemberFlag(
                  member?.contractMarketInfo,
                  member.pickedLocale as PickedLocale,
                )}
              </Flag>
              <Badge
                memberId={member.memberId}
                numberMemberGroups={numberMemberGroups}
              >
                {getMemberGroupName(member.memberId, numberMemberGroups)}
              </Badge>
            </>
          )}
        </Header>
        <MemberDetails memberId={memberId} member={member} />
        <Tabs
          list={panes.map((pane) => ({
            title: pane.tabTitle,
            active: tab === pane.tabName,
            action: () => onChangeTab(pane.tabName),
            hotkey: pane.hotkey,
          }))}
        />
        <div style={{ marginTop: '4rem' }}>{Pane}</div>
      </MemberPageContainer>
    </Flex>
  )
}
