import { ContractTab } from 'components/member/tabs/contracts-tab'
import { DetailsTab } from 'components/member/tabs/DetailsTab'
import { MemberFile } from 'components/member/tabs/files-tab/FileTab'
import { PaymentsTab } from 'components/member/tabs/payments-tab'
import { Quotes } from 'components/member/tabs/quote-tab'

import styled from '@emotion/styled'
import { ClaimsTab } from 'components/member/tabs/ClaimsTab'
import React from 'react'
import { Tab } from 'semantic-ui-react'
import { AccountTab } from './account-tab'
import { CampaignsTab } from './campaigns-tab'
import { DebtTab } from './debt-tab'

const TabContainer = styled(Tab.Pane)`
  &&& {
    display: flex;
    flex-direction: column;
    min-width: 700px;
    margin-bottom: 50px !important;
  }
`

const TabItem: React.FC<{ props: any; TabContent: any }> = ({
  props,
  TabContent,
}) => {
  return (
    <TabContainer>
      <TabContent {...props} />
    </TabContainer>
  )
}

export const memberPagePanes = (props, memberId, member, isHinting) => [
  {
    tabName: 'member',
    menuItem: `Member ${isHinting ? '(1)' : ''}`,
    render: () => (
      <TabItem props={{ ...props, member }} TabContent={DetailsTab} />
    ),
  },
  {
    tabName: 'claims',
    menuItem: `Claims ${isHinting ? '(2)' : ''}`,
    render: () => (
      <TabItem props={{ ...props, memberId }} TabContent={ClaimsTab} />
    ),
  },
  {
    tabName: 'files',
    menuItem: `Files ${isHinting ? '(3)' : ''}`,
    render: () => (
      <TabItem props={{ ...props, memberId }} TabContent={MemberFile} />
    ),
  },
  {
    tabName: 'contracts',
    menuItem: `Contracts ${isHinting ? '(4)' : ''}`,
    render: () => (
      <TabItem props={{ ...props, memberId }} TabContent={ContractTab} />
    ),
  },
  {
    tabName: 'quotes',
    menuItem: `Quotes ${isHinting ? '(5)' : ''}`,
    render: () => (
      <TabItem props={{ ...props, memberId }} TabContent={Quotes} />
    ),
  },
  {
    tabName: 'payments',
    menuItem: `Payments ${isHinting ? '(6)' : ''}`,
    render: () => (
      <TabItem props={{ ...props, memberId }} TabContent={PaymentsTab} />
    ),
  },
  {
    tabName: 'account',
    menuItem: `Account ${isHinting ? '(7)' : ''}`,
    render: () => (
      <TabItem props={{ ...props, memberId }} TabContent={AccountTab} />
    ),
  },
  {
    tabName: 'debt',
    menuItem: `Debt ${isHinting ? '(8)' : ''}`,
    render: () => (
      <TabItem props={{ ...props, memberId }} TabContent={DebtTab} />
    ),
  },
  {
    tabName: 'campaigns',
    menuItem: `Campaigns ${isHinting ? '(9)' : ''}`,
    render: () => (
      <TabItem props={{ ...props, memberId }} TabContent={CampaignsTab} />
    ),
  },
]
