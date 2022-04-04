import styled from '@emotion/styled'
import {
  Button,
  Flex,
  Modal as DefaultModal,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { NotificationItem } from './components/NotificationItem'
import { useNotifications } from 'portals/hope/features/user/notifications/hooks/use-notifications'

const Modal = styled(DefaultModal)`
  max-height: calc(80vh - 6.5rem);

  overflow: hidden;
  padding: 2rem;
  margin: 4rem 0;

  display: flex;
  flex-direction: column;
`

const NotificationContainer = styled(Flex)`
  flex: 1;

  margin-top: 0.5rem;
  overflow: auto;

  ::-webkit-scrollbar-track {
    border-radius: 8px;
    background-color: transparent;
  }
`

export const NotificationsModal: React.FC<{
  onClose: () => void
  visible: boolean
}> = ({ onClose, visible }) => {
  const history = useHistory()
  const { notifications, readAll } = useNotifications()

  useEffect(() => {
    readAll()
  }, [])

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      options={{
        side: 'right',
        position: 'top',
        noDimBg: true,
      }}
    >
      <Flex
        justify="space-between"
        align="center"
        style={{ marginTop: '-0.5rem' }}
      >
        <div>
          <ThirdLevelHeadline>Notifications</ThirdLevelHeadline>
        </div>
        {notifications.length > 8 && (
          <Button
            variant="tertiary"
            onClick={() => history.push('/notifications')}
          >
            View all
          </Button>
        )}
      </Flex>
      <NotificationContainer direction="column">
        {notifications.slice(0, 8).map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </NotificationContainer>
    </Modal>
  )
}
