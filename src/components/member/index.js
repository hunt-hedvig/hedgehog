import copy from 'copy-to-clipboard'
import { Popover } from 'hedvig-ui/popover'
import { FraudulentStatus } from 'lib/fraudulentStatus'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import styled from 'react-emotion'
import { Header as SemanticHeader, Tab } from 'semantic-ui-react'
import {
  formatSsn,
  getMemberGroupName,
  getMemberIdColor,
  MemberAge,
} from 'utils/member'
import memberPagePanes from './tabs/index'
import { MemberFlag } from './shared/member-flag'
import { MemberHistoryContext } from 'utils/member-history'
import { Mount } from 'react-lifecycle-components/dist'
import { useGetMemberInfo } from 'graphql/use-get-member-info'
import { ChatPane } from 'components/member/tabs/ChatPane'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'
import { useHistory } from 'react-router'

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

const Header = styled(SemanticHeader)`
  display: flex;
  align-items: center;
`

const Badge = styled('div')`
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

export const Member = (props) => {
  const history = useHistory()
  const memberId = props.match.params.memberId
  const tab = props.match.params.tab ?? 'contracts'
  const [member, { loading }] = useGetMemberInfo(memberId)
  const getMemberPageTitle = (member) =>
    `${member.firstName || ''} ${member.lastName || ''}`

  if (loading) {
    return null
  }

  const panes = memberPagePanes(props, memberId, member)

  const { numberMemberGroups } = useNumberMemberGroups()

  return (
    <MemberHistoryContext.Consumer>
      {({ pushToMemberHistory }) => (
        <Mount on={() => pushToMemberHistory(memberId)}>
          <MemberPageWrapper>
            <MemberPageContainer>
              <Header size="huge">
                <FraudulentStatus
                  stateInfo={{
                    state: member.fraudulentStatus,
                    description: member.fraudulentStatusDescription,
                  }}
                />
                {getMemberPageTitle(member)}
                {' ('}
                <MemberAge birthDateString={member?.birthDate} />)
                {member && (
                  <>
                    <Flag>
                      <MemberFlag memberId={member.memberId} />
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
                  <MemberDetail>
                    {formatSsn(member.personalNumber)}
                  </MemberDetail>
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
                <Popover contents={<>Click to copy</>}>
                  <MemberDetailLink
                    href={`${window.location.protocol}//${window.location.host}/members/${memberId}`}
                    onClick={(e) => {
                      e.preventDefault()
                      copy(
                        `${window.location.protocol}//${window.location.host}/members/${memberId}`,
                        {
                          format: 'text/plain',
                        },
                      )
                    }}
                  >
                    {memberId}
                  </MemberDetailLink>
                </Popover>
              </MemberDetails>
              <Tab
                style={{ height: '100%' }}
                panes={panes}
                onTabChange={(_, { activeIndex }) =>
                  history.replace(
                    `/members/${memberId}/${panes[activeIndex].tabName}`,
                  )
                }
                renderActiveOnly={true}
                activeIndex={panes.map((pane) => pane.tabName).indexOf(tab)}
              />
            </MemberPageContainer>
            <ChatPane memberId={memberId} />
          </MemberPageWrapper>
        </Mount>
      )}
    </MemberHistoryContext.Consumer>
  )
}

Member.propTypes = {
  match: PropTypes.object.isRequired,
  showNotification: PropTypes.func.isRequired,
}
