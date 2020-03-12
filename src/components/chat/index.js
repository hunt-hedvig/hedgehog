import { FraudulentStatus } from 'lib/fraudulentStatus'
import { disconnect } from 'lib/sockets'
import { reconnect, subscribe } from 'lib/sockets/chat'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import styled from 'react-emotion'
import { Header as SemanticHeader, Tab } from 'semantic-ui-react'
import { getMemberGroup, getMemberIdColor, MemberEmoji } from 'utils/member'
import memberPagePanes from './tabs'
import ChatTab from './tabs/ChatTab'

const ChatPageWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'row',
})

const ChatPageContainer = styled('div')`
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

export default class Chat extends React.Component {
  // constructor(props) {
  //   super(props)
  //   this.state = {
  //     socket: null,
  //     subscription: null,
  //   }
  // }

  // //Move into ChatTab
  // addMessageHandler = (message, forceSendMessage) => {
  //   const { socket } = this.state
  //   const { addMessage, match } = this.props
  //   if (socket) {
  //     addMessage(message, forceSendMessage, match.params.id, socket)
  //   }
  // }

  //Move into ChatTab
  // subscribeSocket = () => {
  //   const {
  //     messageReceived,
  //     match: {
  //       params: { id },
  //     },
  //     messages,
  //     showNotification,
  //     auth,
  //   } = this.props
  //
  //   const { stompClient, subscription } = subscribe(
  //     { messageReceived, showNotification },
  //     id,
  //     auth.email,
  //     messages.activeConnection,
  //   )
  //   return { stompClient, subscription }
  // }

  //Move into ChatTab
  // reconnectSocket = () => {
  //   const {
  //     messageReceived,
  //     match: {
  //       params: { id },
  //     },
  //     setActiveConnection,
  //     showNotification,
  //     auth,
  //   } = this.props
  //
  //   reconnect({ messageReceived, showNotification }, id, auth.email).then(
  //     (result) => {
  //       const { stompClient, subscription } = result
  //       this.setState({ socket: stompClient, subscription })
  //       setActiveConnection(stompClient)
  //     },
  //   )
  // }

  getChatTitle = (member) =>
    `Member: ${
      member && (member.firstName || member.lastName)
        ? member.firstName + ' ' + (member.lastName || '')
        : ''
    }`

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
    //
    //   const { stompClient, subscription } = this.subscribeSocket()
    //   if (!stompClient) {
    //     this.reconnectSocket()
    //   }
    //   this.setState({ socket: stompClient, subscription })
    //
    memberRequest(memberId)
    insuranceRequest(memberId)
    claimsByMember(memberId)
    insurancesListRequest(memberId)
  }

  componentWillUnmount() {
    const { subscription } = this.props
    disconnect(null, subscription)
    this.props.clearMessagesList()
  }

  render() {
    const { messages } = this.props
    const panes = memberPagePanes(this.props, this.addMessageHandler)

    return (
      <ChatPageWrapper>
        <ChatPageContainer>
          <Header size="huge">
            <FraudulentStatus stateInfo={this.getFraudulentStatus()} />
            {this.getChatTitle(messages.member)}
            <MemberEmoji
              birthDateString={messages.member?.birthDate}
              gender={messages.member?.gender}
            />
            {messages.member && (
              <Badge memberId={messages.member.memberId}>
                {getMemberGroup(messages.member.memberId)}
              </Badge>
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
                  ? 5
                  : 0
              }
            />
          )}
        </ChatPageContainer>
        <ChatTab {...this.props} />
      </ChatPageWrapper>
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

Chat.propTypes = {
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
