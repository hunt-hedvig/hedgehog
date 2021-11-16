import styled from '@emotion/styled'
import { Button, Flex, Modal, ThirdLevelHeadline } from '@hedvig-ui'
import { useMe } from 'features/user/hooks/use-me'
import { NotificationItem } from 'features/user/notifications/components/NotificationItem'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import {
  GetMeDocument,
  GetMeQuery,
  useMarkNotificationsAsReadMutation,
} from 'types/generated/graphql'

const ModalContainer = styled(Flex)`
  padding: 1rem;
`

// noinspection CssInvalidPropertyValue
const NotificationContainer = styled(Flex)`
  margin-top: 0.5rem;
  max-height: calc(80vh - 6.5rem);
  overflow-y: scroll;
  overflow: overlay;

  ::-webkit-scrollbar-track {
    border-radius: 8px;
    background-color: transparent;
  }
`

export const NotificationsModal: React.FC<{
  onClose: () => void
}> = ({ onClose }) => {
  const { me } = useMe()
  const [markNotificationsAsRead] = useMarkNotificationsAsReadMutation()
  const history = useHistory()

  useEffect(() => {
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
  }, [])

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
      <ModalContainer direction="column">
        <Flex
          justify="space-between"
          align="center"
          style={{ marginTop: '-0.5rem' }}
        >
          <div>
            <ThirdLevelHeadline>Notifications</ThirdLevelHeadline>
          </div>
          {me.notifications.length > 8 && (
            <Button
              variant="tertiary"
              onClick={() => history.push('/notifications')}
            >
              View all
            </Button>
          )}
        </Flex>
        <NotificationContainer direction="column">
          {me.notifications.slice(0, 8).map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </NotificationContainer>
      </ModalContainer>
    </Modal>
  )
}
