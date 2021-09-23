import styled from '@emotion/styled'
import animateScrollTo from 'animated-scroll-to'
import { parseISO } from 'date-fns'
import { useMessageHistory } from 'graphql/use-message-history'
import React, { HTMLAttributes, useEffect, useRef } from 'react'
import { Message } from './Message'

const MessagesListContainer = styled.div`
  overflow-y: auto;
  padding: 0 20px;
  border-top: 0;
  border-bottom: 0;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
  width: 100%;
`

const EmptyList = styled.h3`
  text-align: center;
`

const getAuthor = (author) => {
  return author ? author : 'bot'
}

export const MessagesList: React.FC<{ memberId: string } & HTMLAttributes<
  HTMLDivElement
>> = ({ memberId, ...props }) => {
  const [messages, { loading }] = useMessageHistory(memberId)
  const messagesList = useRef<HTMLDivElement>(null)
  const latestMessage = useRef<HTMLDivElement>(null)

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
    <MessagesListContainer ref={messagesList} {...props}>
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
