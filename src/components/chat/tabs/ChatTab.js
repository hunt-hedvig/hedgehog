import { ChatPanel } from 'components/chat/chat/ChatPanel'
import MessagesList from 'components/chat/messages/MessagesList'
import gql from 'graphql-tag'
import PropTypes from 'prop-types'
import Resizable from 're-resizable'
import React from 'react'
import { Query } from 'react-apollo'
import styled from 'react-emotion'
import { Icon, Message } from 'semantic-ui-react'

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

export default class ChatTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: window.innerWidth > 1500,
      manualChange: false,
    }
    window.addEventListener('resize', this.resizeControlChat)
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeControlChat, false)
  }

  resizeControlChat = (e) => {
    if (!this.state.manualChange) {
      this.setState({ visible: window.innerWidth > 1500 })
    }
  }

  render() {
    const questionAndMessageIds = this.getQuestionToAnalyze()

    return this.state.visible ? (
      <>
        <Resizable
          style={resizableStyles}
          defaultSize={{ width: '400px', height: '80%' }}
          enable={{ left: true }}
        >
          <ChatHeader ctx={this} />
          <MessagesList
            messages={(this.props.messages && this.props.messages.list) || []}
            error={!!this.props.socket}
            id={(this.props.match && this.props.match.params.id) || ''}
            messageId={
              (this.props.match && this.props.match.params.msgId) || ''
            }
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
                    addMessage={this.props.addMessage}
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
                  memberId={this.props.match.params.id}
                  messageIds={questionAndMessageIds.messageIds}
                  questionToLabel={
                    this.getQuestionAndAnswer(data.getAnswerSuggestion).question
                  }
                  confidence={
                    this.getQuestionAndAnswer(data.getAnswerSuggestion)
                      .confidence
                  }
                  addMessage={this.props.addMessage}
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
        <ChatHeader ctx={this} />
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
      .map((id) => id === +this.props.match.params.id)
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
  <ChatHeaderStyle state={props.ctx.state.visible}>
    <h4>Chat</h4>
    <Icon
      name={props.ctx.state.visible ? 'angle double up' : 'angle double down'}
      size={'large'}
      link
      onClick={() =>
        props.ctx.setState({
          visible: !props.ctx.state.visible,
          manualChange: true,
        })
      }
    />
  </ChatHeaderStyle>
)

ChatTab.propTypes = {
  match: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  addMessage: PropTypes.func.isRequired,
  error: PropTypes.object,
  socket: PropTypes.object,
}
