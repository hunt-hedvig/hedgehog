import styled from '@emotion/styled'
import { Capitalized, Popover, Tabs } from '@hedvig-ui'
import copy from 'copy-to-clipboard'
import { memberPagePanes } from 'features/member/tabs'
import { ChatPane } from 'features/member/tabs/ChatPane'
import { FraudulentStatus } from 'features/member/tabs/member-tab/FraudulentStatus'
import {
  formatSsn,
  getLanguageFlagFromPickedLocale,
  getMemberFlag,
  getMemberGroupName,
  getMemberIdColor,
  MemberAge,
} from 'features/member/utils'
import React, { useEffect } from 'react'
import { Route, RouteComponentProps, useHistory } from 'react-router'
import { Member } from 'types/generated/graphql'
import { useMemberHistory } from 'utils/use-member-history'
import { useNumberMemberGroups } from 'utils/use-number-member-groups'

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

const MemberDetails = styled.div`
  color: ${({ theme }) => theme.mutedText};
  padding-bottom: 4rem;
`
const MemberDetail = styled.span`
  padding-right: 1rem;
`
const MemberDetailLink = MemberDetail.withComponent('a')

export const MemberTabs: React.FC<RouteComponentProps<{
  memberId: string
}> & {
  member: Member
}> = ({ match, member }) => {
  const history = useHistory()
  const pathname = history.location.pathname.split('/')
  const path = pathname[pathname.length - 1]
  const memberId = match.params.memberId

  const panes = memberPagePanes(memberId, member)

  const navigateToTab = (tabName) =>
    history.replace(`/members/${memberId}/${tabName}`)

  const { pushToMemberHistory } = useMemberHistory()

  useEffect(() => {
    pushToMemberHistory(memberId)
    navigateToTab('contracts')
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
                {getMemberFlag(member?.contractMarketInfo, member.pickedLocale)}
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
        <MemberDetails>
          {member?.signedOn && member?.personalNumber && (
            <MemberDetail>{formatSsn(member.personalNumber)}</MemberDetail>
          )}
          {member?.email && (
            <MemberDetailLink href={`mailto:${member.email}`}>
              {member.email}
            </MemberDetailLink>
          )}
          {member?.phoneNumber && (
            <MemberDetailLink href={`tel:${member.phoneNumber}`}>
              {member.phoneNumber}
            </MemberDetailLink>
          )}
          <Popover contents="Click to copy">
            <MemberDetailLink
              href={`${window.location.protocol}//${window.location.host}${history.location.pathname}`}
              onClick={(e) => {
                e.preventDefault()
                copy(
                  `${window.location.protocol}//${window.location.host}${history.location.pathname}`,
                  {
                    format: 'text/plain',
                  },
                )
              }}
            >
              {memberId}
            </MemberDetailLink>
          </Popover>
          {member?.pickedLocale && (
            <MemberDetail>
              Language: {getLanguageFlagFromPickedLocale(member.pickedLocale)}
            </MemberDetail>
          )}
        </MemberDetails>
        <Tabs
          list={panes.map((pane) => ({
            title: pane.tabTitle,
            active: path === pane.tabName,
            action: () => navigateToTab(pane.tabName),
            hotkey: pane.hotkey,
          }))}
        />
        <div style={{ marginTop: '4rem' }}>
          {panes.map((pane) => (
            <Route
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
