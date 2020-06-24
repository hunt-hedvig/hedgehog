import animateScrollTo from 'animated-scroll-to'
import Message from 'components/member/messages/Message'
import PropTypes from 'prop-types'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'react-emotion'
import { useMessageHistory } from '../../../graphql/use-message-history'
import { parseISO } from 'date-fns'

const MessagesListContainer = styled('div')(({ theme }) => ({
  boxSizing: 'border-box',
  overflowY: 'auto',
  padding: '20px 20px 20px',
  background: theme.background,
  border: '1px solid ' + theme.borderStrong,
  borderTop: 0,
  borderBottom: 0,
  display: 'flex',
  flexDirection: 'column-reverse',
}))

const EmptyList = styled('h3')({
  textAlign: 'center',
})

const getAuthor = (author) => {
  return author ? author : 'bot'
}

export const MessagesList = ({ memberId }) => {
  const [messages, { loading }] = useMessageHistory(memberId)
  const [messagesList, setMessagesList] = useState(null)

  const scrollToBottom = () => {
    const bottomMessage = messages[0]
    const bottomMessageElement = document.getElementById(
      `msg-${bottomMessage.globalId.toString()}`,
    )
    if (bottomMessageElement) {
      animateScrollTo(bottomMessageElement, {
        elementToScroll: messagesList,
        maxDuration: 500,
      })
    }
  }

  useEffect(() => {
    if (messages && messagesList) {
      scrollToBottom()
    }
  }, [messages?.length])

  if (loading && !messages) {
    return null
  }

  return (
    <MessagesListContainer innerRef={(el) => setMessagesList(el)}>
      {messages ? (
        messages.map((item) => {
          return (
            <div key={item.globalId}>
              <Message
                key={item.globalId}
                content={item.body}
                left={item.fromId !== memberId}
                msgId={item.globalId}
                timestamp={item.timestamp ? parseISO(item.timestamp) : null}
                from={item.fromId === memberId ? null : getAuthor(item.author)}
              />
            </div>
          )
        })
      ) : (
        <EmptyList>No messages</EmptyList>
      )}
    </MessagesListContainer>
  )
}

MessagesList.propTypes = {
  memberId: PropTypes.string.isRequired,
}
