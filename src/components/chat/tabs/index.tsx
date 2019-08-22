import { AccountTab } from 'components/chat/tabs/AccountTab'
import ChatTab from 'components/chat/tabs/ChatTab'
import ClaimsTab from 'components/chat/tabs/ClaimsTab'
import DetailsTab from 'components/chat/tabs/DetailsTab'
import MemberFile from 'components/chat/tabs/FileTab'
import { MemberDebtComponent } from 'components/chat/tabs/DebtTab'
import InsuranceListTab from 'components/chat/tabs/InsuranceListTab'
import InsuranceTab from 'components/chat/tabs/InsuranceTab'
import PaymentsTab from 'components/chat/tabs/PaymentsTab'

import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Tab } from 'semantic-ui-react'
import styled from 'styled-components'

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
      menuItem: "Files",
      render: () => <TabItem props={props} TabContent={MemberFile} />,
    }, 
    {
      menuItem: "Debt",
      render: () => <TabItem props={props} TabContent={MemberDebtComponent} />
    }
  ]
  if (props.showChatTab) {
    panes.push({
      menuItem: 'Chat',
      render: () => (
        <TabItem
          TabContent={ChatTab}
          props={{ ...props, addMessage, socket }}
          isChatTab={true}
        />
      ),
    })
  }
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
