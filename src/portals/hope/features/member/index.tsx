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
import React from 'react'
import { MemberDetails } from './MemberDetails'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import { PickedLocale } from 'portals/hope/features/config/constants'
import { useGetMemberInfo } from 'portals/hope/features/member/tabs/member-tab/hooks/use-get-member-info'
import { useTitle } from '@hedvig-ui/hooks/use-title'
import { usePushMemberHistory } from 'portals/hope/common/hooks/use-push-member-history'
import { ClaimsTab } from 'portals/hope/features/member/tabs/claims-tab/ClaimsTab'
import { MemberFilesTab } from 'portals/hope/features/member/tabs/files-tab/FileTab'
import { ContractTab } from 'portals/hope/features/member/tabs/contracts-tab'
import { QuotesTab } from 'portals/hope/features/member/tabs/quote-tab/QuotesTab'
import { PaymentsTab } from 'portals/hope/features/member/tabs/payments-tab/PaymentsTab'
import { AccountTab } from 'portals/hope/features/member/tabs/account-tab'
import { MemberTab } from 'portals/hope/features/member/tabs/member-tab/MemberTab'
import { DebtTab } from 'portals/hope/features/member/tabs/debt-tab'
import { CampaignsTab } from 'portals/hope/features/member/tabs/campaigns-tab'

const MemberPageContainer = styled.div<{ chat?: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: ${({ chat }) => (chat ? 'calc(100% - 400px)' : '100%')};
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

const Flag = styled.div`
  display: inline-flex;
  font-size: 3rem;
  margin-left: 0.5rem;
`

export const MemberTabs: React.FC<{
  memberId: string
  tab: string
  onChangeTab: (newTab: string) => void
  onClickClaim: (claimId: string) => void
  chat?: boolean
  title?: string
}> = ({ memberId, tab, onChangeTab, onClickClaim, chat = true, title }) => {
  const [member] = useGetMemberInfo(memberId)
  const { numberMemberGroups } = useNumberMemberGroups()
  const panes = memberPagePanes(memberId)
  usePushMemberHistory(memberId)

  useTitle(
    title ??
      (member ? `${member?.firstName} ${member?.lastName}` : 'Loading...'),
  )

  if (!member) {
    return null
  }

  const paneComponent = () => {
    switch (tab) {
      case 'claims':
        return <ClaimsTab memberId={memberId} onClickClaim={onClickClaim} />
      case 'files':
        return <MemberFilesTab memberId={memberId} />
      case 'contracts':
        return <ContractTab memberId={memberId} />
      case 'quotes':
        return <QuotesTab memberId={memberId} />
      case 'payments':
        return <PaymentsTab memberId={memberId} />
      case 'account':
        return <AccountTab memberId={memberId} />
      case 'member':
        return <MemberTab memberId={memberId} />
      case 'debt':
        return <DebtTab memberId={memberId} />
      case 'campaigns':
        return <CampaignsTab memberId={memberId} />
    }
  }

  return (
    <Flex>
      <MemberPageContainer chat={chat}>
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
        <div style={{ marginTop: '4rem' }}>{paneComponent()}</div>
      </MemberPageContainer>
    </Flex>
  )
}
