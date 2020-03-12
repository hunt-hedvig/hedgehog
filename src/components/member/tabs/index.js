import { AccountTab } from 'components/member/tabs/AccountTab'
import ChatPane from 'components/member/tabs/ChatPane'
import ClaimsTab from 'components/member/tabs/ClaimsTab'
import { MemberDebtComponent } from 'components/member/tabs/DebtTab'
import DetailsTab from 'components/member/tabs/DetailsTab'
import MemberFile from 'components/member/tabs/FileTab'
import InsuranceListTab from 'components/member/tabs/InsuranceListTab'
import InsuranceTab from 'components/member/tabs/InsuranceTab'
import PaymentsTab from 'components/member/tabs/PaymentsTab'
import { Quotes } from 'components/member/tabs/quote-tab'
import { Contracts } from 'components/member/tabs/contract-tab'
import { CreateTicketStandAlone } from 'components/tickets/ticket/create-ticket/create-ticket-stand-alone'

import PropTypes from 'prop-types'
import React from 'react'
import { Tab } from 'semantic-ui-react'
import styled from 'react-emotion'

const TabContainer = styled(Tab.Pane)`
  &&& {
    display: flex;
    flex-direction: column;
    min-width: 700px;
    margin-bottom: 50px !important;
  }
`

const TabItem = ({ props, TabContent }) => (
  <TabContainer>
    <TabContent {...props} />
  </TabContainer>
)

TabItem.propTypes = {
  props: PropTypes.object.isRequired,
  TabContent: PropTypes.func,
  isChatTab: PropTypes.bool,
  hideTab: PropTypes.bool,
}

/* eslint-disable react/display-name */
const memberPagePanes = (props, addMessage, socket) => {
  const { insurance } = props
  const panes = [
    {
      menuItem: 'Details',
      render: () => <TabItem props={props} TabContent={DetailsTab} />,
    },
    {
      menuItem: 'Claims',
      render: () => <TabItem props={props} TabContent={ClaimsTab} />,
    },
    {
      menuItem: 'Files',
      render: () => <TabItem props={props} TabContent={MemberFile} />,
    },
    {
      menuItem: 'Debt',
      render: () => <TabItem props={props} TabContent={MemberDebtComponent} />,
    },
    {
      menuItem: 'Tickets',
      render: () => (
        <TabItem
          props={{
            memberId: props.match.params.memberId,
            ticketType: 'REMIND',
          }}
          TabContent={CreateTicketStandAlone}
        /> // FIXME: Send props like other locations
      ),
    },
  ]
  if (props.showChatTab) {
    panes.push({
      menuItem: 'Chat',
      render: () => (
        <TabItem
          TabContent={ChatPane}
          props={{ ...props, addMessage, socket }}
          isChatTab={true}
        />
      ),
    })
  }
  panes.push(
    {
      menuItem: 'Contracts',
      render: () => (
        <TabItem
          props={{ memberId: props.match.params.id }}
          TabContent={Contracts}
        />
      ),
    },
    {
      menuItem: 'Quotes',
      render: () => (
        <TabItem
          props={{ memberId: props.match.params.id }}
          TabContent={Quotes}
        />
      ),
    },
  )
  if (!insurance.error.length && insurance.data) {
    panes.push(
      {
        menuItem: 'Current Insurance',
        render: () => <TabItem props={props} TabContent={InsuranceTab} />,
      },
      {
        menuItem: 'All Insurances',
        render: () => <TabItem props={props} TabContent={InsuranceListTab} />,
      },
      {
        menuItem: 'Payments',
        render: () => <TabItem props={props} TabContent={PaymentsTab} />,
      },
      {
        menuItem: 'Account',
        render: () => <TabItem props={props} TabContent={AccountTab} />,
      },
    )
  }

  return panes
}
export default memberPagePanes
