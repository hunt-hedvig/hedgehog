import animateScrollTo from 'animated-scroll-to'
import Message from 'components/member/messages/Message'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'react-emotion'

const MessagesListContainer = styled('div')(({ theme }) => ({
  flex: 1,
  boxSizing: 'border-box',
  overflowY: 'auto',
  padding: '20px 20px 20px',
  background: theme.background,
}))

const EmptyList = styled('h3')({
  textAlign: 'center',
})

const getAuthor = (author) => {
  return author ? author : 'bot'
}

export default class MessagesList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      messagesLength: 0,
    }
  }

  componentDidUpdate() {
    this.theRealScroller()
  }

  componentDidMount() {
    if (this.props.attachScrollListener) {
      this.props.attachScrollListener(this.theRealScroller)
    }
  }

  theRealScroller = () => {
    /* eslint-disable */
    const list = this.messagesList
    if (!list) {
      return
    }
    const { messages } = this.props
    if (messages.length !== this.state.messagesLength) {
      this.setState({ messagesLength: messages.length })
      const lastMessage = messages[messages.length - 1]
      const lastMessageElement = document.getElementById(
        `msg-${lastMessage.globalId}`,
      )
      if (lastMessageElement) {
        animateScrollTo(lastMessageElement, {
          elementToScroll: list,
          maxDuration: 500,
        })
      }
    }
  }

  render() {
    const { messages, error } = this.props
    const memberId = parseInt(this.props.id, 10)

    return (
      <MessagesListContainer innerRef={(el) => (this.messagesList = el)}>
        {messages.length ? (
          messages.map((item, key) => (
            <Message
              key={key}
              content={item.body}
              left={item.header.fromId !== memberId}
              msgId={item.globalId}
              timestamp={item.localTimestamp}
              from={
                item.header.fromId === memberId ? null : getAuthor(item.author)
              }
            />
          ))
        ) : (
          <EmptyList>
            {error
              ? 'No messages with this Member'
              : 'Lost connection to server'}
          </EmptyList>
        )}
      </MessagesListContainer>
    )
  }
}

MessagesList.propTypes = {
  id: PropTypes.string.isRequired,
  messageId: PropTypes.string,
  messages: PropTypes.array,
  error: PropTypes.bool,
  attachScrollListener: PropTypes.func,
}
