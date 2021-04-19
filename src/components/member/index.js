import copy from 'copy-to-clipboard'
import { Popover } from 'hedvig-ui/popover'
import { FraudulentStatus } from 'lib/fraudulentStatus'
import * as PropTypes from 'prop-types'
import React from 'react'
import { useEffect, useState } from 'react'
import styled from '@emotion/styled'
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
import { ChatPane } from 'components/member/tabs/ChatPane'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'
import { useCommandLine } from 'utils/hooks/command-line-hook'
import { Keys } from 'utils/hooks/key-press-hook'
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

const getIndex = (tab, panes) => panes.map((pane) => pane.tabName).indexOf(tab)

export const Member = (props) => {
  const history = useHistory()
  const memberId = props.match.params.memberId
  const tab = props.match.params.tab ?? 'contracts'

  const member = props.member

  const { registerActions, isHintingControl } = useCommandLine()

  const panes = memberPagePanes(props, memberId, member, isHintingControl)
  const getMemberPageTitle = (member) =>
    `${member.firstName || ''} ${member.lastName || ''}`

  const navigateToTab = (tabName) =>
    history.replace(`/members/${memberId}/${tabName}`)

  const formattedFirstName =
    Boolean(member.firstName) ? member.firstName + (member.firstName.slice(-1) === 's' ? "'" : "'s") : "Member's"

  registerActions([
    {
      label: `Copy ${formattedFirstName} member page link to clipboard`,
      keys: [Keys.Option, Keys.M],
      onResolve: () => {
        copy(
          `${window.location.protocol}//${window.location.host}/members/${memberId}`,
          {
            format: 'text/plain',
          },
        )
      },
    },
    {
      label: `Copy ${formattedFirstName} email to clipboard`,
      keys: [Keys.Option, Keys.E],
      onResolve: () => {
        copy(member.email, {
          format: 'text/plain',
        })
      },
    },
    {
      label: `Member information`,
      keys: [Keys.Control, Keys.One],
      onResolve: () => {
        navigateToTab(panes[0].tabName)
      },
    },
    {
      label: `${formattedFirstName} claims`,
      keys: [Keys.Control, Keys.Two],
      onResolve: () => {
        navigateToTab(panes[1].tabName)
      },
    },
    {
      label: `${formattedFirstName} files`,
      keys: [Keys.Control, Keys.Three],
      onResolve: () => {
        navigateToTab(panes[2].tabName)
      },
    },
    {
      label: `${formattedFirstName} contracts`,
      keys: [Keys.Control, Keys.Four],
      onResolve: () => {
        navigateToTab(panes[3].tabName)
      },
    },
    {
      label: `${formattedFirstName} quotes`,
      keys: [Keys.Control, Keys.Five],
      onResolve: () => {
        navigateToTab(panes[4].tabName)
      },
    },
    {
      label: `${formattedFirstName} payments`,
      keys: [Keys.Control, Keys.Six],
      onResolve: () => {
        navigateToTab(panes[5].tabName)
      },
    },
    {
      label: `${formattedFirstName} account`,
      keys: [Keys.Control, Keys.Seven],
      onResolve: () => {
        navigateToTab(panes[6].tabName)
      },
    },
    {
      label: `${formattedFirstName} debt`,
      keys: [Keys.Control, Keys.Eight],
      onResolve: () => {
        navigateToTab(panes[7].tabName)
      },
    },
    {
      label: `${formattedFirstName} campaigns`,
      keys: [Keys.Control, Keys.Nine],
      onResolve: () => {
        navigateToTab(panes[8].tabName)
      },
    },
  ])

  const [activeIndex, setActiveIndex] = useState(getIndex(tab, panes))

  useEffect(() => {
    setActiveIndex(getIndex(tab, panes))
  }, [tab])

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
                panes={panes}
                onTabChange={(_, { activeIndex }) =>
                  navigateToTab(panes[activeIndex].tabName)
                }
                renderActiveOnly={true}
                activeIndex={activeIndex}
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
