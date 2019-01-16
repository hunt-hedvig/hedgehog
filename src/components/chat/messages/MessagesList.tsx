import Message from 'components/chat/messages/Message'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import styled from 'styled-components'

const MessagesListContainer = styled.div`
  height: calc(100% - 130px);
  box-sizing: border-box;
  overflow-y: auto;
  padding: 20px 20px 60px;
  flex-grow: 1;
`

const EmptyList = styled.h3`
  text-align: center;
`

const getAuthor = (author: string) => {
  return author ? author : 'bot'
}

export default class MessagesList extends React.Component {
  constructor(props) {
    super(props)
  }

  public componentWillReceiveProps() {
    /* eslint-disable */
    setTimeout(() => {
      const list = this.messagesList
      this.messagesList.scrollTop = list ? list.scrollHeight : 0
      const id = this.props.messageId
      const msgNode = document.getElementById(`msg-${id}`)
      if (id && msgNode) {
        msgNode.scrollIntoView()
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
