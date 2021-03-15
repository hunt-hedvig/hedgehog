import { ContractTab } from 'components/member/tabs/contracts-tab'
import { DetailsTab } from 'components/member/tabs/DetailsTab'
import MemberFile from 'components/member/tabs/FileTab'
import PaymentsTab from 'components/member/tabs/payments-tab'
import { Quotes } from 'components/member/tabs/quote-tab'

import { ClaimsTab } from 'components/member/tabs/ClaimsTab'
import { useContractMarketInfo } from 'graphql/use-get-member-contract-market-info'
import React from 'react'
import styled from 'react-emotion'
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
  const memberId = props.match.params.memberId
  const [contractMarketInfo] = useContractMarketInfo(memberId)
  return (
    <TabContainer>
      <TabContent {...props} contractMarketInfo={contractMarketInfo} />
    </TabContainer>
  )
}

const memberPagePanes = (props, memberId, member) => [
  {
    tabName: 'member',
    menuItem: 'Member',
    render: () => (
      <TabItem props={{ ...props, member }} TabContent={DetailsTab} />
    ),
  },
  {
    tabName: 'claims',
    menuItem: 'Claims',
    render: () => (
      <TabItem props={{ ...props, memberId }} TabContent={ClaimsTab} />
    ),
  },
  {
    tabName: 'files',
    menuItem: 'Files',
    render: () => <TabItem props={props} TabContent={MemberFile} />,
  },
  {
    tabName: 'contracts',
    menuItem: 'Contracts',
    render: () => (
      <TabItem props={{ ...props, memberId }} TabContent={ContractTab} />
    ),
  },
  {
    tabName: 'quotes',
    menuItem: 'Quotes',
    render: () => (
      <TabItem props={{ ...props, memberId }} TabContent={Quotes} />
    ),
  },
  {
    tabName: 'payments',
    menuItem: 'Payments',
    render: () => <TabItem props={props} TabContent={PaymentsTab} />,
  },
  {
    tabName: 'account',
    menuItem: 'Account',
    render: () => (
      <TabItem props={{ ...props, memberId }} TabContent={AccountTab} />
    ),
  },
  {
    tabName: 'debt',
    menuItem: 'Debt',
    render: () => (
      <TabItem props={{ ...props, memberId }} TabContent={DebtTab} />
    ),
  },
  {
    tabName: 'campaigns',
    menuItem: 'Campaigns',
    render: () => (
      <TabItem props={{ ...props, memberId }} TabContent={CampaignsTab} />
    ),
  },
]
export default memberPagePanes
