import styled from '@emotion/styled'
import { Capitalized, Tabs } from '@hedvig-ui'
import { memberPagePanes } from 'portals/hope/features/member/tabs'
import { ChatPane } from 'portals/hope/features/member/tabs/ChatPane'
import { FraudulentStatus } from 'portals/hope/features/member/tabs/member-tab/FraudulentStatus'
import {
  getMemberFlag,
  getMemberGroupName,
  getMemberIdColor,
  MemberAge,
} from 'portals/hope/features/member/utils'
import React, { useEffect } from 'react'
import { Route, RouteComponentProps, useHistory } from 'react-router'
import { Member } from 'types/generated/graphql'
import { MemberDetails } from './MemberDetails'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import { useMemberHistory } from 'portals/hope/features/user/hooks/use-member-history'
import { PickedLocale } from 'portals/hope/features/config/constants'

const MemberPageWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'row',
})

const MemberPageContainer = styled('div')`
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

export const MemberTabs: React.FC<
  RouteComponentProps<{
    memberId: string
  }> & {
    member: Member
  }
> = ({ match, member }) => {
  const history = useHistory()
  const pathname = history.location.pathname.split('/')
  const path =
    pathname.length === 4 ? pathname[pathname.length - 1] : 'contracts'

  const memberId = match.params.memberId

  const panes = memberPagePanes(memberId)

  const navigateToTab = (tabName: string) =>
    history.replace(`/members/${memberId}/${tabName}`)

  const { pushToMemberHistory } = useMemberHistory()

  useEffect(() => {
    pushToMemberHistory(memberId)
    navigateToTab(path)
  }, [])

  const { numberMemberGroups } = useNumberMemberGroups()

  return (
    <MemberPageWrapper>
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
            active: path === pane.tabName,
            action: () => navigateToTab(pane.tabName),
            hotkey: pane.hotkey,
          }))}
        />
        <div style={{ marginTop: '4rem' }}>
          {panes.map((pane, id) => (
            <Route
              key={`${pane.tabName}-${id}`}
              path={`${match.path}/${pane.tabName}`}
              component={pane.component}
            />
          ))}
        </div>
      </MemberPageContainer>
      <ChatPane memberId={memberId} />
    </MemberPageWrapper>
  )
}
