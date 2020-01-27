import { FraudulentStatus } from 'lib/fraudulentStatus'
import { disconnect } from 'lib/sockets'
import { reconnect, subscribe } from 'lib/sockets/chat'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import styled from 'react-emotion'
import { Header, Tab } from 'semantic-ui-react'
import { MemberEmoji } from 'utils/member'
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
`

export default class Chat extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: null,
      subscription: null,
    }
  }

  public addMessageHandler = (message, forceSendMessage) => {
    const { socket } = this.state
    const { addMessage, match } = this.props
    if (socket) {
      addMessage(message, forceSendMessage, match.params.id, socket)
    }
  }

  public subscribeSocket = () => {
    const {
      messageReceived,
      match: {
        params: { id },
      },
      messages,
      showNotification,
      client,
    } = this.props

    const { stompClient, subscription } = subscribe(
      { messageReceived, showNotification },
      id,
      client.id,
      messages.activeConnection,
    )
    return { stompClient, subscription }
  }

  public reconnectSocket = () => {
    const {
      messageReceived,
      match: {
        params: { id },
      },
      setActiveConnection,
      showNotification,
      client,
    } = this.props

    reconnect({ messageReceived, showNotification }, id, client.id).then(
      (result) => {
        const { stompClient, subscription } = result
        this.setState({ socket: stompClient, subscription })
        setActiveConnection(stompClient)
      },
    )
  }

  public getChatTitle = (member) =>
    `Member: ${
      member && (member.firstName || member.lastName)
        ? member.firstName + ' ' + (member.lastName || '')
        : ''
    }`

  public componentDidMount() {
    const {
      match: {
        params: { id },
      },
      memberRequest,
      insuranceRequest,
      insurancesListRequest,
      claimsByMember,
    } = this.props

    const { stompClient, subscription } = this.subscribeSocket()
    if (!stompClient) {
      this.reconnectSocket()
    }
    this.setState({ socket: stompClient, subscription })

    memberRequest(id)
    insuranceRequest(id)
    claimsByMember(id)
    insurancesListRequest(id)
  }

  public componentWillUnmount() {
    const { subscription } = this.state
    disconnect(null, subscription)
    this.props.clearMessagesList()
  }

  public render() {
    const { messages } = this.props
    const panes = memberPagePanes(
      this.props,
      this.addMessageHandler,
      this.state.socket,
    )
    return (
      <ChatPageWrapper>
        <ChatPageContainer>
          <Header size="huge">
            <FraudulentStatus stateInfo={this.getFraudulentStatus()} />
            {this.getChatTitle(messages.member)}
            <MemberEmoji
              birthDateString={messages.member.birthDate}
              gender={messages.member.gender}
            />
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
        <ChatTab {...this.props} addMessage={this.addMessageHandler} />
      </ChatPageWrapper>
    )
  }

  public getFraudulentStatus = () => ({
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
  client: PropTypes.object.isRequired,
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
