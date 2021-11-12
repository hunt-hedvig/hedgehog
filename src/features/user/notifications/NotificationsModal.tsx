import styled from '@emotion/styled'
import { Button, Flex, Modal, ThirdLevelHeadline } from '@hedvig-ui'
import chroma from 'chroma-js'
import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import { useMe } from 'features/user/hooks/use-me'
import React from 'react'
import { ChatFill } from 'react-bootstrap-icons'
import {
  GetMeDocument,
  GetMeQuery,
  useMarkNotificationsAsReadMutation,
} from 'types/generated/graphql'

const NotificationItem = styled(Flex)<{ read?: boolean }>`
  :first-of-type {
    margin-top: 0.5rem;
  }

  margin-top: 1rem;

  border-radius: 8px;
  background-color: ${({ theme, read }) =>
    read
      ? chroma(theme.backgroundTransparent)
          .alpha(0.03)
          .hex()
      : chroma(theme.accent)
          .brighten(2)
          .alpha(0.15)
          .hex()};
  padding: 1rem;
  cursor: pointer;
`

const UnreadCircle = styled.div`
  height: 1rem;
  width: 1rem;
  border-radius: 50%;
  margin-right: 1rem;

  background-color: ${({ theme }) =>
    chroma(theme.accent)
      .brighten(1)
      .hex()};
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
    user
      ? chroma(theme.accent)
          .brighten(1)
          .hex()
      : theme.highlight};
`

const NotificationMessage = styled.div`
  padding-left: 1rem;
  font-size: 1rem;
`

const NotificationTimestamp = styled.div`
  padding-left: 1rem;
  font-size: 0.85rem;
  color: ${({ theme }) =>
    chroma(theme.semiStrongForeground)
      .brighten(0.75)
      .hex()};
  padding-top: 0.2rem;
`

export const NotificationsModal: React.FC<{
  onClose: () => void
}> = ({ onClose }) => {
  const { me } = useMe()
  const [markNotificationsAsRead] = useMarkNotificationsAsReadMutation()

  return (
    <Modal
      onClose={() => {
        markNotificationsAsRead({
          optimisticResponse: { markNotificationsAsRead: true },
          update: (cache, { data: response }) => {
            if (!response?.markNotificationsAsRead) {
              return
            }

            const cachedData = cache.readQuery({
              query: GetMeDocument,
            }) as GetMeQuery

            cache.writeQuery({
              query: GetMeDocument,
              data: {
                me: {
                  ...cachedData.me,
                  user: {
                    ...cachedData.me.user,
                    notifications: cachedData.me.user.notifications.map(
                      (notification) => ({ ...notification, read: true }),
                    ),
                  },
                },
              },
            })
          },
        })
        onClose()
      }}
      withoutHeader={true}
      width="400px"
      height="80vh"
      side="right"
      position="top"
      padding="7rem 3rem 0rem"
      dimBackground={false}
    >
      <Flex style={{ padding: '1rem' }} direction="column">
        <Flex
          justify="space-between"
          align="center"
          style={{ marginTop: '-0.5rem' }}
        >
          <div>
            <ThirdLevelHeadline>Notifications</ThirdLevelHeadline>
          </div>
          <Button variant="tertiary">View all</Button>
        </Flex>
        {me.notifications.slice(0, 10).map((notification) => (
          <NotificationItem
            key={notification.id}
            align="center"
            read={notification.read}
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
            {!notification.read && <UnreadCircle />}
          </NotificationItem>
        ))}
      </Flex>
    </Modal>
  )
}
