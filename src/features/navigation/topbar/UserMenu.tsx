import styled from '@emotion/styled'
import { FadeIn } from '@hedvig-ui'
import { Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useNavigation } from '@hedvig-ui/hooks/navigation/use-navigation'
import { useClickOutside } from '@hedvig-ui/hooks/use-click-outside'
import { useDarkmode } from '@hedvig-ui/hooks/use-darkmode'
import { useMe } from 'features/user/hooks/use-me'
import React, { useRef } from 'react'
import {
  BoxArrowLeft,
  GearFill,
  MoonFill,
  SunFill,
  ThreeDots,
} from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import { CircleButton } from './TopBar'

const MenuWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`

const Username = styled.span`
  margin-right: 1.5rem;
  cursor: pointer;
`

const List = styled.ul`
  & {
    padding: 0;
  }
  &,
  & li {
    list-style: none;
    margin: 0;
  }

  position: absolute;
  z-index: 1000;
  top: 45px;
  right: 0;

  width: 200px;
  border-radius: 8px;
  box-shadow: 0px 8px 20px 0px rgba(34, 60, 80, 0.2);

  li:first-of-type {
    border-radius: 8px 8px 0 0;
  }

  li:last-of-type {
    border-radius: 0 0 8px 8px;
  }

  li:not(:last-of-type) {
    border-bottom: 1px solid ${({ theme }) => theme.border};
  }
`

const Option = styled.li`
  cursor: pointer;
  background-color: ${({ theme }) => theme.backgroundLight};
  padding: 0 15px;

  height: 35px;

  display: flex;
  align-items: center;

  & span {
    margin-left: 1rem;
    font-size: 14px;
    line-height: 0;
  }

  &:hover {
    background-color: ${({ theme }) => theme.accentLighter};
  }
`

const UserMenu = () => {
  const history = useHistory()
  const listRef = useRef(null)
  const [view, setView] = React.useState(false)
  const { isDarkmode, setIsDarkmode } = useDarkmode()
  const { me } = useMe()
  const { register } = useNavigation()

  const close = () => setView(false)
  const toggle = () => setView((prev) => !prev)

  useClickOutside(listRef, close)

  return (
    <MenuWrapper>
      <Username onClick={() => history.push('/profile')}>
        {me.fullName}
      </Username>
      <CircleButton
        onClick={toggle}
        {...register('UserMenuButton', {
          focus: Keys.N,
          resolve: () => {
            toggle()
            return 'SettingsButton'
          },
          neighbors: {
            right: 'SharePageButton',
          },
        })}
      >
        <ThreeDots />
      </CircleButton>
      {view && (
        <List ref={listRef}>
          <FadeIn duration={200}>
            <Option
              onClick={() => {
                history.push('/profile')
                close()
              }}
              {...register('SettingsButton', {
                parent: () => {
                  close()
                  return 'UserMenuButton'
                },
                resolve: () => {
                  history.push('/profile')
                  close()
                },
                neighbors: {
                  down: 'DarkModeButton',
                },
              })}
            >
              <GearFill /> <span>Settings</span>
            </Option>
            <Option
              onClick={() => {
                setIsDarkmode(!isDarkmode)
                close()
              }}
              {...register('DarkModeButton', {
                parent: () => {
                  close()
                  return 'UserMenuButton'
                },
                resolve: () => {
                  setIsDarkmode(!isDarkmode)
                  close()
                },
                neighbors: {
                  up: 'SettingsButton',
                  down: 'LogoutButton',
                },
              })}
            >
              {isDarkmode ? <SunFill /> : <MoonFill />}{' '}
              <span>{isDarkmode ? 'Light mode' : 'Dark mode'}</span>
            </Option>
            <Option
              onClick={() => {
                window.location.pathname = '/login/logout'
                close()
              }}
              {...register('LogoutButton', {
                parent: () => {
                  close()
                  return 'UserMenuButton'
                },
                resolve: () => {
                  window.location.pathname = '/login/logout'
                  close()
                },
                neighbors: {
                  up: 'DarkModeButton',
                },
              })}
            >
              <BoxArrowLeft />
              <span>Logout</span>
            </Option>
          </FadeIn>
        </List>
      )}
    </MenuWrapper>
  )
}

export default UserMenu
