import styled from '@emotion/styled'
import animateScrollTo from 'animated-scroll-to'
import Message from 'components/member/messages/Message'
import { parseISO } from 'date-fns'
import { useMessageHistory } from 'graphql/use-message-history'
import PropTypes from 'prop-types'
import React, { useEffect, useRef } from 'react'

const MessagesListContainer = styled.div`
  overflow-y: auto;
  padding: 0 20px;
  background: ${({ theme }) => theme.background};
  border-top: 0;
  border-bottom: 0;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
`

const EmptyList = styled.h3`
  text-align: center;
`

const getAuthor = (author) => {
  return author ? author : 'bot'
}

export const MessagesList: React.FC<{ memberId: string }> = ({ memberId }) => {
  const [messages, { loading }] = useMessageHistory(memberId)
  const messagesList = useRef(null)
  const latestMessage = useRef(null)

  const scrollToBottom = async () => {
    await animateScrollTo(latestMessage.current!, {
      elementToScroll: messagesList.current!,
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
    <MessagesListContainer ref={messagesList}>
      {messages ? (
        messages.map((item, index) => {
          return (
            <Message
              ref={index === 0 ? latestMessage : undefined}
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
