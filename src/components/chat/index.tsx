import { FraudulentStatus } from 'lib/fraudulentStatus'
import { disconnect } from 'lib/sockets'
import { reconnect, subscribe } from 'lib/sockets/chat'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Header, Tab } from 'semantic-ui-react'
import styled from 'styled-components'
import memberPagePanes from './tabs'

const ChatPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 700px;
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

  public addMessageHandler = (message) => {
    const { socket } = this.state
    const { addMessage, match } = this.props
    if (socket) {
      addMessage(message, match.params.id, socket)
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
      (reslut) => {
        const { stompClient, subscription } = reslut
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
    const {
      messages,
      history: { location },
    } = this.props
    const panes = memberPagePanes(
      this.props,
      this.addMessageHandler,
      this.state.socket,
    )
    const routeData = location.state ? location.state.to : null
    return (
      <ChatPageContainer>
        <Header size="huge">
          <FraudulentStatus stateInfo={this.getFraudulentStatus()} />
          {this.getChatTitle(messages.member)}
        </Header>
        <Tab
          style={{ height: '100%' }}
          panes={panes}
          renderActiveOnly={true}
          defaultActiveIndex={
            routeData === 'insurance'
              ? 3
              : routeData === 'payments'
                ? 5
                : routeData === 'details'
                  ? 0
                  : 1
          }
        />
      </ChatPageContainer>
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
