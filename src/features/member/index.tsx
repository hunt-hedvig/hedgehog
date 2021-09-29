import styled from '@emotion/styled'
import { Popover } from '@hedvig-ui'
import { useCommandLine } from '@hedvig-ui/utils/command-line-hook'
import { Keys } from '@hedvig-ui/utils/key-press-hook'
import copy from 'copy-to-clipboard'
import { memberPagePanes } from 'features/member/tabs'
import { ChatPane } from 'features/member/tabs/ChatPane'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { RouteComponentProps, useHistory } from 'react-router'
import { Header as SemanticHeader, Tab } from 'semantic-ui-react'
import { Member } from 'types/generated/graphql'
import { FraudulentStatus } from 'utils/fraudulentStatus'
import {
  formatSsn,
  getLanguageFlagFromPickedLocale,
  getMemberFlag,
  getMemberGroupName,
  getMemberIdColor,
  MemberAge,
} from 'utils/member'
import { MemberHistoryContext } from 'utils/member-history'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'

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

const getIndex = (tab, panes) => panes.map((pane) => pane.tabName).indexOf(tab)

export const MemberTabs: React.FC<RouteComponentProps<{
  memberId: string
  tab: string
}> & {
  member: Member
}> = ({ match, member, ...props }) => {
  const history = useHistory()
  const memberId = match.params.memberId
  const tab = match.params.tab ?? 'contracts'

  const { registerActions, isHintingControl } = useCommandLine()

  const panes = memberPagePanes(props, memberId, member, isHintingControl)

  const navigateToTab = (tabName) =>
    history.replace(`/members/${memberId}/${tabName}`)

  const formattedFirstName = Boolean(member.firstName)
    ? member.firstName + (member.firstName!.slice(-1) === 's' ? "'" : "'s")
    : "Member's"

  const { pushToMemberHistory } = useContext(MemberHistoryContext)

  useEffect(() => {
    pushToMemberHistory(memberId)
  }, [])

  registerActions([
    {
      label: `Copy ${formattedFirstName} member page link to clipboard`,
      keys: [Keys.Option, Keys.M],
      onResolve: () => {
        copy(
          `${window.location.protocol}//${window.location.host}${history.location.pathname}`,
          {
            format: 'text/plain',
          },
        )
        toast.success('Member link copied')
      },
    },
    {
      label: `${formattedFirstName} claims`,
      keys: [Keys.Control, Keys.One],
      onResolve: () => {
        navigateToTab(panes[0].tabName)
      },
    },
    {
      label: `${formattedFirstName} files`,
      keys: [Keys.Control, Keys.Two],
      onResolve: () => {
        navigateToTab(panes[1].tabName)
      },
    },
    {
      label: `${formattedFirstName} contracts`,
      keys: [Keys.Control, Keys.Three],
      onResolve: () => {
        navigateToTab(panes[2].tabName)
      },
    },
    {
      label: `${formattedFirstName} quotes`,
      keys: [Keys.Control, Keys.Four],
      onResolve: () => {
        navigateToTab(panes[3].tabName)
      },
    },
    {
      label: `${formattedFirstName} payments`,
      keys: [Keys.Control, Keys.Five],
      onResolve: () => {
        navigateToTab(panes[4].tabName)
      },
    },
    {
      label: `${formattedFirstName} account`,
      keys: [Keys.Control, Keys.Six],
      onResolve: () => {
        navigateToTab(panes[5].tabName)
      },
    },
    {
      label: `Member information`,
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

  if (Boolean(member.email)) {
    registerActions([
      {
        label: `Copy ${formattedFirstName} email to clipboard`,
        keys: [Keys.Option, Keys.E],
        onResolve: () => {
          copy(member.email!, {
            format: 'text/plain',
          })
          toast.success('Email copied')
        },
      },
    ])
  }

  const [currentIndex, setCurrentIndex] = useState(getIndex(tab, panes))

  useEffect(() => {
    setCurrentIndex(getIndex(tab, panes))
  }, [tab])

  const { numberMemberGroups } = useNumberMemberGroups()

  return (
    <MemberPageWrapper>
      <MemberPageContainer>
        <Header size="huge">
          <FraudulentStatus
            stateInfo={{
              state: member.fraudulentStatus,
              description: member.fraudulentStatusDescription,
            }}
          />
          {`${member.firstName || ''} ${member.lastName || ''}`}
          {' ('}
          <MemberAge birthDateString={member?.birthDate} />)
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
        <Tab
          panes={panes}
          onTabChange={(_, { activeIndex }) =>
            navigateToTab(panes[activeIndex!].tabName)
          }
          renderActiveOnly={true}
          activeIndex={currentIndex}
        />
      </MemberPageContainer>
      <ChatPane memberId={memberId} />
    </MemberPageWrapper>
  )
}
