import styled from '@emotion/styled'
import { Spinner } from '@hedvig-ui'
import { parseISO } from 'date-fns'
import { useMessageHistory } from 'graphql/use-message-history'
import React, { HTMLAttributes } from 'react'
import { Message } from './Message'

const MessagesListContainer = styled.div`
  height: 35em;
  padding: 20px;
  overflow: auto;
  display: flex;
  flex-direction: column-reverse;
`

const MessagesListPlaceholder = styled.div`
  height: 35em;
  display: flex;
  align-items: center;
  justify-content: center;
`

const EmptyList = styled.h3`
  text-align: center;
`

const getAuthor = (author) => {
  return author ? author : 'bot'
}

export const MessagesList: React.FC<{
  memberId: string
} & HTMLAttributes<HTMLDivElement>> = ({ memberId, ...props }) => {
  const [messages, { loading }] = useMessageHistory(memberId)

  if (loading && !messages) {
    return (
      <MessagesListPlaceholder>
        <Spinner />
      </MessagesListPlaceholder>
    )
  }

  return (
    <>
      {messages ? (
        loading ? (
          <MessagesListPlaceholder>
            <Spinner />
          </MessagesListPlaceholder>
        ) : (
          <MessagesListContainer {...props}>
            {messages.map((item, index) => (
              <Message
                key={`${item.globalId}-${index}`}
                content={item.body}
                left={item.fromId !== memberId}
                timestamp={item.timestamp ? parseISO(item.timestamp) : null}
                from={item.fromId === memberId ? null : getAuthor(item.author)}
              />
            ))}
          </MessagesListContainer>
        )
      ) : (
        <EmptyList>No messages</EmptyList>
      )}
    </>
  )
}
