import styled from '@emotion/styled'
import { Button, Flex, Modal, ThirdLevelHeadline } from '@hedvig-ui'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { useMarkAllNotificationsAsReadMutation } from 'types/generated/graphql'
import { useMe } from '../hooks/use-me'
import { NotificationItem } from './components/NotificationItem'

const StyledModal = styled(Modal)`
  max-height: calc(80vh - 6.5rem);

  overflow: hidden;
  padding: 2rem;
  margin: 4rem 0;

  display: flex;
  flex-direction: column;
`

// noinspection CssInvalidPropertyValue
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
}> = ({ onClose }) => {
  const { me } = useMe()
  const [markAllNotificationsAsRead] = useMarkAllNotificationsAsReadMutation()
  const history = useHistory()

  useEffect(() => {
    markAllNotificationsAsRead({
      refetchQueries: ['GetMe'],
    })
  }, [])

  return (
    <StyledModal
      onClose={onClose}
      options={{
        side: 'right',
        position: 'top',
        noDimBackground: true,
      }}
      // withoutHeader={true}
      // width="400px"
      // height="80vh"
      // side="right"
      // position="top"
      // padding="7rem 3rem 0rem"
      // dimBackground={false}
    >
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
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </NotificationContainer>
    </StyledModal>
  )
}
