import styled from '@emotion/styled'
import { Button, Flex, Modal, ThirdLevelHeadline } from '@hedvig-ui'
import chroma from 'chroma-js'
import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import { useMe } from 'features/user/hooks/use-me'
import React from 'react'

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
          .alpha(0.1)
          .hex()};
  padding: 1rem;
  cursor: pointer;
`

const UserCircle = styled.div`
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

  background-color: ${({ theme }) =>
    chroma(theme.accent)
      .brighten(1)
      .hex()};
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
  return (
    <Modal
      onClose={onClose}
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
        {me.notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            align="center"
            read={notification.read}
          >
            <UserCircle>{notification.user.signature}</UserCircle>
            <Flex direction="column">
              <NotificationMessage>{notification.message}</NotificationMessage>
              <NotificationTimestamp>
                {formatDistanceToNowStrict(parseISO(notification.createdAt), {
                  addSuffix: true,
                })}
              </NotificationTimestamp>
            </Flex>
          </NotificationItem>
        ))}
      </Flex>
    </Modal>
  )
}
