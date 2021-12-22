import styled from '@emotion/styled'
import { Flex } from '@hedvig-ui'
import { isPressing, Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import chroma from 'chroma-js'
import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import React from 'react'
import { ChatFill } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import { UserNotification } from 'types/generated/graphql'

const NotificationContainer = styled(Flex)<{ read?: boolean }>`
  :first-of-type {
    margin-top: 0.5rem;
  }

  margin-top: 1rem;

  border-radius: 8px;
  transition: background-color 4000ms;

  background-color: ${({ theme, read }) =>
    read
      ? chroma(theme.backgroundTransparent).alpha(0.03).hex()
      : chroma(theme.accent).brighten(2).alpha(0.15).hex()};
  padding: 1rem;
  cursor: pointer;
`

const NotificationCircle = styled.div<{ user?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;

  height: 2.8rem;
  width: 2.8rem;
  border-radius: 50%;

  margin-left: 0.5rem;

  color: ${({ theme }) => theme.accentContrast};
  font-weight: bold;
  font-size: 1.2rem;

  background-color: ${({ theme, user = false }) =>
    user ? chroma(theme.accent).brighten(1).hex() : theme.highlight};
`

const NotificationMessage = styled.div`
  padding-left: 1rem;
  font-size: 1rem;
`

const NotificationTimestamp = styled.div`
  padding-left: 1rem;
  font-size: 0.85rem;
  color: ${({ theme }) =>
    chroma(theme.semiStrongForeground).brighten(0.75).hex()};
  padding-top: 0.2rem;
`

export const NotificationItem: React.FC<{ notification: UserNotification }> = ({
  notification,
}) => {
  const history = useHistory()

  return (
    <NotificationContainer
      align="center"
      read={notification.read}
      onClick={() => history.push(notification.url)}
      tabIndex={0}
      onKeyDown={(e) =>
        isPressing(e, Keys.Enter) && history.push(notification.url)
      }
    >
      {notification.from ? (
        <NotificationCircle user>
          {notification.from.signature}
        </NotificationCircle>
      ) : (
        <NotificationCircle>
          <ChatFill />
        </NotificationCircle>
      )}
      <Flex direction="column">
        <NotificationMessage>{notification.message}</NotificationMessage>
        <NotificationTimestamp>
          {formatDistanceToNowStrict(parseISO(notification.createdAt), {
            addSuffix: true,
          })}
        </NotificationTimestamp>
      </Flex>
    </NotificationContainer>
  )
}
