import { FraudulentStatus } from 'lib/fraudulentStatus'
import { disconnect } from 'lib/sockets'
import { reconnect, subscribe } from 'lib/sockets/chat'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import styled from 'react-emotion'
import { Header as SemanticHeader, Tab } from 'semantic-ui-react'
import { getMemberGroup, getMemberIdColor, MemberEmoji } from 'utils/member'
import memberPagePanes from './tabs'
import ChatPane from './tabs/ChatPane'
import { MemberFlag } from './shared/member-flag'

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
  display: inline-block;
  padding: 0.5rem 1rem;
  line-height: 1;
  font-size: 1rem;
  ${({ memberId }) => `background: ${getMemberIdColor(memberId)}`};
  border-radius: 8px;
  color: #fff;
`

const Flag = styled('div')`
  padding-left: 1rem;
  display: inline-block;
  font-size: 3rem
`

export default class Member extends React.Component {
  getMemberPageTitle = (member) =>
    `${member && (member.firstName || '') + ' ' + (member.lastName || '')}`

  componentDidMount() {
    const {
      match: {
        params: { memberId },
      },
      memberRequest,
      insuranceRequest,
      insurancesListRequest,
      claimsByMember,
    } = this.props

    memberRequest(memberId)
    insuranceRequest(memberId)
    claimsByMember(memberId)
    insurancesListRequest(memberId)
  }

  render() {
    const { messages } = this.props
    const panes = memberPagePanes(this.props, this.addMessageHandler)

    return (
      <MemberPageWrapper>
        <MemberPageContainer>
          <Header size="huge">
            <FraudulentStatus stateInfo={this.getFraudulentStatus()} />
            {this.getMemberPageTitle(messages.member)}
            <MemberEmoji
              birthDateString={messages.member?.birthDate}
              gender={messages.member?.gender}
            />
            {messages.member && (
              <>
                <Badge memberId={messages.member.memberId}>
                  {getMemberGroup(messages.member.memberId)}
                </Badge>
                <Flag>
                  <MemberFlag memberId={messages.member.memberId} />
                </Flag>
              </>
            )}
          </Header>
          {this.props.insurance.requesting || (
            <Tab
              style={{ height: '100%' }}
              panes={panes}
              renderActiveOnly={true}
              defaultActiveIndex={
                !!this.props.insurance?.data ||
                this.props.insurance?.list?.length > 0
                  ? 7
                  : 0
              }
            />
          )}
        </MemberPageContainer>
        <ChatPane {...this.props} />
      </MemberPageWrapper>
    )
  }

  getFraudulentStatus = () => ({
    state:
      this.props.messages && this.props.messages.member
        ? this.props.messages.member.fraudulentStatus
        : '',
    description:
      this.props.messages && this.props.messages.member
        ? this.props.messages.member.fraudulentDescription
        : '',
  })
}

Member.propTypes = {
  messageReceived: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  showNotification: PropTypes.func.isRequired,
  addMessage: PropTypes.func.isRequired,
  setActiveConnection: PropTypes.func.isRequired,
  memberRequest: PropTypes.func.isRequired,
  clearMessagesList: PropTypes.func.isRequired,
  claimsByMember: PropTypes.func.isRequired,
  insuranceRequest: PropTypes.func.isRequired,
  insurancesListRequest: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
}
