import { ChatPanel } from 'components/member/chat/ChatPanel'
import MessagesList from 'components/member/messages/MessagesList'
import { reconnect, subscribe } from 'lib/sockets/chat'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import Resizable from 're-resizable'
import React from 'react'
import { Query } from 'react-apollo'
import styled from 'react-emotion'
import { Icon, Message } from 'semantic-ui-react'
import { disconnect } from 'lib/sockets'

const resizableStyles = {
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
  height: '80%',
  top: '100px',
  right: '10px',
  boxShadow: '0 5px 40px rgba(0, 0, 0, 0.16)',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  zIndex: '999',
}

const ChatHeaderStyle = styled.div`
  position: ${(props) => (!props.state ? 'fixed' : '')};
  right: ${(props) => (!props.state ? 0 : '')};
  height: 40px;
  background-color: #cccccc;
  padding: 10px;
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  justify-content: space-between;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`
const GET_SUGGESTED_ANSWER_QUERY = gql`
  query GetSuggestedAnswer($question: String) {
    getAnswerSuggestion(question: $question) {
      reply
      text
      confidence
      allReplies {
        reply
        intent
      }
    }
  }
`

export default class ChatPane extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: window.innerWidth > 1500,
      manualChange: false,
      socket: null,
      subscription: null,
    }
    window.addEventListener('resize', this.resizeControlChat)
  }

  componentDidMount() {
    const { stompClient, subscription } = this.subscribeSocket()
    if (!stompClient) {
      this.reconnectSocket()
    }
    this.setState({ socket: stompClient, subscription })
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeControlChat, false)
    const { subscription } = this.state
    disconnect(null, subscription)
    this.props.clearMessagesList()
  }

  resizeControlChat = (e) => {
    if (!this.state.manualChange) {
      this.setState({ visible: window.innerWidth > 1500 })
    }
  }

  addMessageHandler = (message, forceSendMessage) => {
    const { socket } = this.state
    const { addMessage, match } = this.props
    if (socket) {
      addMessage(message, forceSendMessage, match.params.memberId, socket)
    }
  }

  subscribeSocket = () => {
    const {
      messageReceived,
      match: {
        params: { memberId },
      },
      messages,
      showNotification,
      auth,
    } = this.props

    const { stompClient, subscription } = subscribe(
      { messageReceived, showNotification },
      memberId,
      auth.email,
      messages.activeConnection,
    )
    return { stompClient, subscription }
  }

  reconnectSocket = () => {
    const {
      messageReceived,
      match: {
        params: { memberId },
      },
      setActiveConnection,
      showNotification,
      auth,
    } = this.props

    reconnect({ messageReceived, showNotification }, memberId, auth.email).then(
      (result) => {
        const { stompClient, subscription } = result
        this.setState({ socket: stompClient, subscription })
        setActiveConnection(stompClient)
      },
    )
  }

  onResizeClick = () => {
    this.setState(
      {
        visible: !this.state.visible,
        manualChange: true,
      },
      () => {
        this.scroller()
      },
    )
  }

  scroller = null

  render() {
    const questionAndMessageIds = this.getQuestionToAnalyze()

    return this.state.visible ? (
      <>
        <Resizable
          style={resizableStyles}
          defaultSize={{ width: '400px', height: '80%' }}
          enable={{ left: true }}
        >
          <ChatHeader
            visible={this.state.visible}
            onResizeClick={this.onResizeClick}
          />
          <MessagesList
            messages={this.props.messages?.list ?? []}
            error={!!this.props.socket}
            id={(this.props.match && this.props.match.params.memberId) || ''}
            messageId={
              (this.props.match && this.props.match.params.msgId) || ''
            }
            attachScrollListener={(theRealScroller) => {
              this.scroller = theRealScroller
            }}
          />
          <Query
            query={GET_SUGGESTED_ANSWER_QUERY}
            variables={{ question: questionAndMessageIds.lastMemberMessages }}
          >
            {({ data, loading, error }) => {
              if (loading || error) {
                return (
                  <ChatPanel
                    allReplies={null}
                    memberId=""
                    messageIds={[]}
                    questionToLabel=""
                    confidence={0}
                    addMessage={this.addMessageHandler}
                    messages={
                      (this.props.messages && this.props.messages.list) || []
                    }
                    suggestedAnswer=""
                  />
                )
              }

              return (
                <ChatPanel
                  allReplies={
                    (data.getAnswerSuggestion &&
                      data.getAnswerSuggestion.length > 0 &&
                      data.getAnswerSuggestion[0].allReplies) ||
                    null
                  }
                  memberId={this.props.match.params.memberId}
                  messageIds={questionAndMessageIds.messageIds}
                  questionToLabel={
                    this.getQuestionAndAnswer(data.getAnswerSuggestion).question
                  }
                  confidence={
                    this.getQuestionAndAnswer(data.getAnswerSuggestion)
                      .confidence
                  }
                  addMessage={this.addMessageHandler}
                  messages={
                    (this.props.messages && this.props.messages.list) || []
                  }
                  suggestedAnswer={
                    this.getQuestionAndAnswer(data.getAnswerSuggestion).answer
                  }
                />
              )
            }}
          </Query>
          {this.props.error && (
            <Message negative>{this.props.error.message}</Message>
          )}
        </Resizable>
      </>
    ) : (
      <>
        <ChatHeader
          visible={this.state.visible}
          onResizeClick={this.onResizeClick}
        />
      </>
    )
  }

  getQuestionToAnalyze() {
    let lastMemberMessages = ''
    let messageIds = []

    if (
      !this.props.messages ||
      !this.props.messages.list ||
      this.props.messages.list.length === 0
    ) {
      return { lastMemberMessages, messageIds }
    }

    const messages = this.props.messages.list

    const fromIds = messages.map((message) => message.header.fromId)

    const lastNonMemberIndex = fromIds
      .map((id) => id === +this.props.match.params.memberId)
      .lastIndexOf(false)

    const lastMemberMessagesArray = messages.filter(
      (message, index) =>
        ['free.chat.message', 'free.chat.from.bo', 'free.chat.start'].includes(
          message.id,
        ) && index > lastNonMemberIndex,
    )

    messageIds = lastMemberMessagesArray.map(
      (message) => message.header.messageId,
    )
    lastMemberMessages = lastMemberMessagesArray
      .map((message) => message.body.text)
      .join(' ')

    return { lastMemberMessages, messageIds }
  }

  getQuestionAndAnswer(responses) {
    let question = ''
    let answer = ''
    let confidence = 0

    if (!responses || responses.length !== 1) {
      return { question, answer, confidence }
    }
    question = responses[0].text
    answer = responses[0].reply
    confidence = responses[0].confidence
    return { question, answer, confidence }
  }
}

const ChatHeader = (props) => (
  <ChatHeaderStyle state={props.visible}>
    <h4>Chat</h4>
    <Icon
      name={props.visible ? 'angle double up' : 'angle double down'}
      size={'large'}
      link
      onClick={props.onResizeClick}
    />
  </ChatHeaderStyle>
)

ChatPane.propTypes = {
  match: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  addMessage: PropTypes.func.isRequired,
  error: PropTypes.object,
  socket: PropTypes.object,
}
