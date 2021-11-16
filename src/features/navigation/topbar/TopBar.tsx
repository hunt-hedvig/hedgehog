import styled from '@emotion/styled'
import { Flex } from '@hedvig-ui'
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { UsersOnPath } from 'features/navigation/topbar/components/UsersOnPath'
import { useMe } from 'features/user/hooks/use-me'
import { NotificationsModal } from 'features/user/notifications/NotificationsModal'
import { UserPanel } from 'features/user/UserPanel'
import React, { useEffect, useState } from 'react'
import { BellFill, PeopleFill } from 'react-bootstrap-icons'
import UserMenu from './UserMenu'

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
  background-color: ${({ theme }) => theme.background};
  box-shadow: 1px 5px 20px rgba(0, 0, 0, 0.05);
  width: 100%;
  height: 4.5rem;
  padding: 1rem 2rem;
  margin-bottom: 2rem;
`

export const CircleButton = styled.div`
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
  }
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

  return (
    <CircleButton onClick={onClick} style={{ marginLeft: '1em' }}>
      <BellFill />
      {me.notifications.some((notification) => !notification.read) && (
        <NewNotificationsOrb />
      )}
    </CircleButton>
  )
}

export const TopBar = () => {
  const [showUsers, setShowUsers] = useState(false)
  const [showUserNotifications, setShowUserNotifications] = useState(false)
  const isEscapePressed = useKeyIsPressed(Keys.Escape)

  useEffect(() => {
    if (isEscapePressed) {
      setShowUsers(false)
    }
  }, [isEscapePressed])

  return (
    <Wrapper>
      {showUserNotifications && (
        <NotificationsModal
          onClose={() => {
            setShowUserNotifications(false)
          }}
        />
      )}

      <UserPanel
        visible={showUsers}
        onClickOutside={() => setShowUsers(false)}
      />
      <TopBarContainer
        pushLeft={showUsers}
        direction="row"
        justify="flex-end"
        align="center"
      >
        <UsersOnPath />

        <UserMenu />

        <NotificationsButton onClick={() => setShowUserNotifications(true)} />

        <CircleButton
          onClick={() => setShowUsers(true)}
          style={{ marginLeft: '1em' }}
        >
          <PeopleFill />
        </CircleButton>
      </TopBarContainer>
    </Wrapper>
  )
}
