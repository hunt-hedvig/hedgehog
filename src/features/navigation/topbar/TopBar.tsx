import styled from '@emotion/styled'
import { Flex } from '@hedvig-ui'
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useNavigation } from '@hedvig-ui/hooks/navigation/use-navigation'
import { UsersOnPath } from 'features/navigation/topbar/components/UsersOnPath'
import { useMe } from 'features/user/hooks/use-me'
import { NotificationsModal } from 'features/user/notifications/NotificationsModal'
import { ShareIcon } from 'features/user/share/components/ShareIcon'
import { ShareModal } from 'features/user/share/ShareModal'
import { VerboseNotificationListener } from 'features/user/share/VerboseNotificationListener'
import { UserPanel } from 'features/user/UserPanel'
import React, { useEffect, useState } from 'react'
import { BellFill, PeopleFill } from 'react-bootstrap-icons'
import UserMenu from './UserMenu'

const Wrapper = styled.div`
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
  background-color: ${({ theme }) => theme.background};
  box-shadow: 1px 5px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 4.5rem;
  padding: 1rem 2rem;
`

export const CircleButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;
  background-color: ${({ theme }) => theme.accentLighter};

  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.accentLight};
  }

  & svg {
    height: 16px;
    width: 16px;
    pointer-events: none;
  }

  border: none;
`

const TopBarContainer = styled(Flex)<{ pushLeft: boolean }>`
  transition: margin-right 400ms;
  margin-right: ${({ pushLeft }) => (pushLeft ? '300px' : '0')};
`

const NewNotificationsOrb = styled.div`
  position: relative;
  margin-top: -1.5rem;
  margin-right: -1rem;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;

  background-color: rgb(255, 0, 77);
`

const NotificationsButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => {
  const { me } = useMe()
  const { register } = useNavigation()

  return (
    <CircleButton
      onClick={onClick}
      {...register('NotificationsButton', {
        resolve: () => {
          onClick()
        },
        neighbors: {
          right: 'UsersOnlineButton',
          left: 'SharePageButton',
        },
      })}
    >
      <BellFill />
      {me.notifications.some((notification) => !notification.read) && (
        <NewNotificationsOrb />
      )}
    </CircleButton>
  )
}

export const TopBar = () => {
  const [showUsers, setShowUsers] = useState(false)
  const [closingUsers, setClosingUsers] = useState(false)
  const [showUserNotifications, setShowUserNotifications] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const isEscapePressed = useKeyIsPressed(Keys.Escape)

  const { register } = useNavigation()

  useEffect(() => {
    if (isEscapePressed) {
      setShowUsers(false)
    }
  }, [isEscapePressed])

  const closeUsersHandler = () => {
    setClosingUsers(true)
    setTimeout(() => {
      setShowUsers(false)
      setClosingUsers(false)
    }, 350)
  }

  return (
    <Wrapper>
      <VerboseNotificationListener />
      {showUserNotifications && (
        <NotificationsModal
          onClose={() => {
            setShowUserNotifications(false)
          }}
        />
      )}

      {showShareModal && (
        <ShareModal onClose={() => setShowShareModal(false)} />
      )}

      {showUsers && (
        <UserPanel closing={closingUsers} onClickOutside={closeUsersHandler} />
      )}
      <TopBarContainer
        pushLeft={showUsers && !closingUsers}
        direction="row"
        justify="flex-end"
        align="center"
      >
        <UsersOnPath />

        <UserMenu />

        <div style={{ marginLeft: '1rem' }} />
        <CircleButton
          onClick={() => setShowShareModal(true)}
          {...register('SharePageButton', {
            resolve: () => {
              setShowShareModal(true)
            },
            neighbors: {
              right: 'NotificationsButton',
              left: 'UserMenuButton',
            },
          })}
        >
          <ShareIcon />
        </CircleButton>

        <div style={{ marginLeft: '1rem' }} />
        <NotificationsButton onClick={() => setShowUserNotifications(true)} />

        <div style={{ marginLeft: '1rem' }} />
        <CircleButton
          id="show_users_online"
          onClick={() => setShowUsers(true)}
          {...register('UsersOnlineButton', {
            resolve: () => {
              setShowUsers(true)
            },
            neighbors: {
              left: 'NotificationsButton',
            },
          })}
        >
          <PeopleFill />
        </CircleButton>
      </TopBarContainer>
    </Wrapper>
  )
}
