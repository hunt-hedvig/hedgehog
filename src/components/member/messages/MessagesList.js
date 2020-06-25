import animateScrollTo from 'animated-scroll-to'
import Message from 'components/member/messages/Message'
import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'
import styled from 'react-emotion'
import { useMessageHistory } from '../../../graphql/use-message-history'
import { parseISO } from 'date-fns'

const MessagesListContainer = styled('div')(({ theme }) => ({
  boxSizing: 'border-box',
  overflowY: 'auto',
  padding: '0 20px',
  background: theme.background,
  border: '1px solid ' + theme.borderStrong,
  borderTop: 0,
  borderBottom: 0,
  height: '100%',
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
  const messagesList = useRef()
  const latestMessage = useRef()

  const scrollToBottom = () => {
    animateScrollTo(latestMessage.current, {
      elementToScroll: messagesList.current,
      maxDuration: 1000,
    })
  }

  useEffect(() => {
    if (messages && messagesList.current && latestMessage.current) {
      scrollToBottom()
    }
  }, [messages?.length])

  if (loading && !messages) {
    return null
  }

  return (
    <MessagesListContainer innerRef={messagesList}>
      {messages ? (
        messages.map((item, key) => {
          return (
            <Message
              ref={key === 0 ? latestMessage : undefined}
              key={item.globalId}
              content={item.body}
              left={item.fromId !== memberId}
              timestamp={item.timestamp ? parseISO(item.timestamp) : null}
              from={item.fromId === memberId ? null : getAuthor(item.author)}
            />
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
