import { ChatPanel } from 'components/chat/chat/ChatPanel'
import MessagesList from 'components/chat/messages/MessagesList'
import * as PropTypes from 'prop-types'
import Resizable from 're-resizable'
import * as React from 'react'
import { Icon, Message } from 'semantic-ui-react'
import styled from 'styled-components'
import gql from 'graphql-tag'
import { Mutation, Query } from 'react-apollo'

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
query GetSuggestedAnswer ($question: String) 
{
  getAnswerSuggestion(question: $question) {
    intent
    reply
    text
    allReplies
           
  }
}
`;

export default class ChatTab extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      visible: window.innerWidth > 1500,
      manualChange: false,
    }
    window.addEventListener('resize', this.resizeControlChat)
  }
  public componentWillUnmount() {
    window.removeEventListener('resize', this.resizeControlChat, false)
  }

  public resizeControlChat = (e) => {
    if (!this.state.manualChange) {
      this.setState({ visible: window.innerWidth > 1500 })
    }
  }

  private getQuestionToAnalyze(){
    if (this.props.messages && this.props.messages.list.length > 0){
      const lastMessage = this.props.messages.list[this.props.messages.list.length-1];

      // this.props.match.params.id is the member id
      if (lastMessage.header.fromId == this.props.match.params.id && lastMessage.id === "free.chat.message"){

        return lastMessage.body.text;

      }else{
      return '';
    }      
      
    }

  }

  public render() {
    

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

          {/* alternatives for updating the query https://www.apollographql.com/docs/react/essentials/queries/#polling-and-refetching*/}
          <Query query={GET_SUGGESTED_ANSWER_QUERY} variables={{question: this.getQuestionToAnalyze()}}>
          {({ data, loading, error }) => {
            if (loading) return <ChatPanel
            allReplies = {null}
            memberId = ''
            messageId = ''
            questionToLabel = ''
            addMessage={this.props.addMessage}
            messages={(this.props.messages && this.props.messages.list) || []}
            suggestedAnswer = ''
          />;

            if (error) return <ChatPanel
            allReplies = {null}
            memberId = ''
            messageId = ''
            questionToLabel = ''
            addMessage={this.props.addMessage}
            messages={(this.props.messages && this.props.messages.list) || []}
            suggestedAnswer = ''
          />;

            //sending an empty string to the python API returns an empty list so this statement fixes it                        
            //const answer = (JSON.parse(data.getAnswerSuggestion.message).length == 0) ? '' : JSON.parse(data.getAnswerSuggestion.message)[0].reply ;
            //const intent = (JSON.parse(data.getAnswerSuggestion.message).length == 0) ? '' : JSON.parse(data.getAnswerSuggestion.message)[0].intent ;
            const lastMessage = (this.props.messages && this.props.messages.list.length > 0) ? this.props.messages.list[this.props.messages.list.length-1] : {header: {messageId: 0}};
    
            return (

            <ChatPanel
            allReplies = {JSON.parse(data.getAnswerSuggestion.allReplies)}
            memberId = {this.props.match.params.id}
            messageId = {String(lastMessage.header.messageId)}
            questionToLabel = {this.getQuestionToAnalyze()}
            addMessage={this.props.addMessage}
            messages={(this.props.messages && this.props.messages.list) || []}
            suggestedAnswer = {data.getAnswerSuggestion.reply}
          />)
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
