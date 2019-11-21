import animateScrollTo from 'animated-scroll-to'
import Message from 'components/chat/messages/Message'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import styled from 'react-emotion'

const MessagesListContainer = styled('div')({
  boxSizing: 'border-box',
  overflowY: 'auto',
  padding: '20px 20px 20px',
})

const EmptyList = styled('h3')({
  textAlign: 'center',
})

const getAuthor = (author: string) => {
  return author ? author : 'bot'
}

export default class MessagesList extends React.Component {
  constructor(props) {
    super(props)
  }

  public componentDidUpdate() {
    /* eslint-disable */
    setTimeout(() => {
      const list = this.messagesList
      if (!list) {
        return
      }
      const { messages } = this.props
      const lastMessage = messages[messages.length - 1]
      const lastMessageElement = document.getElementById(
        `msg-${lastMessage.globalId}`,
      )
      if (lastMessageElement) {
        animateScrollTo(lastMessageElement, { elementToScroll: list })
      }
    })
    /* eslint-enable */
  }

  public render() {
    const { messages, error } = this.props
    const id = parseInt(this.props.id, 10)

    return (
      <MessagesListContainer innerRef={(el) => (this.messagesList = el)}>
        {messages.length ? (
          messages.map((item, key) => (
            <Message
              key={key}
              content={item.body}
              left={item.header.fromId !== id}
              msgId={item.globalId}
              timestamp={item.localTimestamp}
              from={
                item.header.fromId !== id ? getAuthor(item.author) : 'member'
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
}
