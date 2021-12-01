import styled from '@emotion/styled'
import { Capitalized } from '@hedvig-ui'
import { memberPagePanes, MemberTabsList } from 'features/member/tabs'
import { ChatPane } from 'features/member/tabs/ChatPane'
import { FraudulentStatus } from 'features/member/tabs/member-tab/FraudulentStatus'
import {
  getMemberFlag,
  getMemberGroupName,
  getMemberIdColor,
  MemberAge,
} from 'features/member/utils'
import { useNumberMemberGroups } from 'features/user/hooks/use-number-member-groups'
import React from 'react'
import { Route, RouteComponentProps } from 'react-router'
import { Member } from 'types/generated/graphql'
import { MemberDetails } from './MemberDetails'

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

export const MemberTabs: React.FC<RouteComponentProps<{
  memberId: string
}> & {
  member: Member
}> = ({ match, member }) => {
  const memberId = match.params.memberId

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
        <MemberDetails memberId={memberId} member={member} />

        <MemberTabsList memberId={memberId} member={member} />

        <div style={{ marginTop: '4rem' }}>
          {memberPagePanes(memberId, member).map((pane, id) => (
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
