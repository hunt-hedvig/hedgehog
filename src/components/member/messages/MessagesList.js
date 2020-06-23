import animateScrollTo from 'animated-scroll-to'
import Message from 'components/member/messages/Message'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import styled from 'react-emotion'
import { useMessageHistory } from '../../../graphql/use-message-history'
import { fromUnixTime, format } from 'date-fns'

const MessagesListContainer = styled('div')(({ theme }) => ({
  flex: 1,
  boxSizing: 'border-box',
  overflowY: 'auto',
  padding: '20px 20px 20px',
  background: theme.background,
  border: '1px solid ' + theme.borderStrong,
  borderTop: 0,
  borderBottom: 0,
}))

const EmptyList = styled('h3')({
  textAlign: 'center',
})

const getAuthor = (author) => {
  return author ? author : 'bot'
}

export const MessagesList = ({ memberId }) => {
  const [messages] = useMessageHistory(memberId)
  const [messagesList, setMessagesList] = useState(null)

  const scrollToBottom = () => {
    const lastMessage = messages[messages.length - 1]
    const lastMessageElement = document.getElementById(
      `msg-${lastMessage.globalId}`,
    )
    if (lastMessageElement) {
      animateScrollTo(lastMessageElement, {
        elementToScroll: messagesList,
        maxDuration: 500,
      })
    }
  }

  useEffect(() => {
    if (messages && messagesList) {
      scrollToBottom()
    }
  }, [messages])

  return (
    <MessagesListContainer innerRef={(el) => setMessagesList(el)}>
      {messages ? (
        messages.map((item) => {
          return (
            <div key={item.globalId}>
              <Message
                key={item.globalId}
                content={item.body}
                left={item.header.fromId !== +memberId}
                msgId={item.globalId}
                timestamp={item.timestamp ? fromUnixTime(item.timestamp) : null}
                from={
                  item.header.fromId === +memberId
                    ? null
                    : getAuthor(item.author)
                }
              />
            </div>
          )
        })
      ) : (
        <EmptyList>No messages with this Member</EmptyList>
      )}
    </MessagesListContainer>
  )
}

MessagesList.propTypes = {
  memberId: PropTypes.string.isRequired,
}
