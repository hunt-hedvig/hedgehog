import styled from '@emotion/styled'
import { FadeIn } from '@hedvig-ui'
import { useClickOutside } from '@hedvig-ui/hooks/use-click-outside'
import React, { useRef } from 'react'
import {
  BoxArrowLeft,
  GearFill,
  PeopleFill,
  PersonFill,
} from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import { CircleButton } from './TopBar'

const SettingsWrapper = styled.div`
  position: relative;
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

interface SettingsProps {
  me?: any
  setShowUsers?: any
}

const SettingsList: React.FC<SettingsProps> = ({ setShowUsers }) => {
  const history = useHistory()
  const listRef = useRef(null)
  const [view, setView] = React.useState(false)

  const close = () => setView(false)

  useClickOutside(listRef, close)

  return (
    <SettingsWrapper>
      <CircleButton onClick={() => setView((prev) => !prev)}>
        <PersonFill />
      </CircleButton>
      {view && (
        <List ref={listRef}>
          <FadeIn duration={200}>
            <Option
              onClick={() => {
                history.push('/profile')
                close()
              }}
            >
              <GearFill /> <span>Settings</span>
            </Option>
            <Option
              onClick={() => {
                setShowUsers((prev) => !prev)
                close()
              }}
            >
              <PeopleFill />
              <span>Users Online</span>
            </Option>
            <Option
              onClick={() => {
                window.location.pathname = '/login/logout'
                close()
              }}
            >
              <BoxArrowLeft />
              <span>Logout</span>
            </Option>
          </FadeIn>
        </List>
      )}
    </SettingsWrapper>
  )
}

export default SettingsList
