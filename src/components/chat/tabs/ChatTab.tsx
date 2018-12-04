import ChatPanel from 'components/chat/chat/ChatPanel'
import MessagesList from 'components/chat/messages/MessagesList'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Icon, Message } from 'semantic-ui-react'
import styled from 'styled-components'

const ChatContainer = styled.div`
  position: fixed;
  height: 80%;
  top: 100px;
  margin-right: 10px;
  width: 350px;
  right: 0;
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16) !important;
  border-radius: 8px !important;
  background-color: #ffffff;
`

const ChatHeaderStyle = styled.div`
  position: ${(props) => (!props.state ? 'fixed' : '')};
  right: ${(props) => (!props.state ? 0 : '')};
  height: 40px;
  background-color: #cccccc;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
`

export default class ChatTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      visible: window.innerWidth > 1400,
      manualChange: false,
    }
    window.addEventListener('resize', this.resizeControlChat)
  }
  public componentWillUnmount() {
    window.removeEventListener('resize', this.resizeControlChat, false)
  }

  public resizeControlChat = (e) => {
    if (!this.state.manualChange) {
      this.setState({ visible: window.innerWidth > 1400 })
    }
  }

  public render() {
    return this.state.visible ? (
      <>
        <ChatContainer>
          <ChatHeader ctx={this} />
          <MessagesList
            messages={(this.props.messages && this.props.messages.list) || []}
            error={!!this.props.socket}
            id={(this.props.match && this.props.match.params.id) || ''}
            messageId={
              (this.props.match && this.props.match.params.msgId) || ''
            }
          />
          <ChatPanel
            addMessage={this.props.addMessage}
            select={(this.props.messages && this.props.messages.select) || ''}
          />
          {this.props.error && (
            <Message negative>{this.props.error.message}</Message>
          )}
        </ChatContainer>
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
