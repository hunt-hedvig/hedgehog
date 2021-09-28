import styled from '@emotion/styled'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { Key, Keys, useKeyIsPressed } from 'utils/hooks/key-press-hook'

/** Tab: */

const TabStyled = styled.li<{ active?: boolean }>`
  transition: all 0.3s;

  display: flex;
  align-items: center;
  justify-content: center;

  ${({ active, theme }) => `
    border: 1px solid ${!active ? theme.border : theme.accentLighter};
    background: ${!active ? theme.background : theme.accent};
    color: ${!active ? theme.foreground : theme.accentContrast};
  `}

  height: 30px;

  margin: 0;

  font-size: 14px;
  list-style: none;
  outline: none;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  border-radius: 15px 15px 0 0;

  &:focus {
    padding: 4px 14px;
    border: 2px solid ${({ theme }) => theme.borderStrong};
  }
`

export interface TabProps {
  active?: boolean
  action: () => void
  title: string
  name?: string
  hotkey?: {
    name: string
    key: Key
  }
}

export const Tab: React.FC<TabProps> = ({
  active,
  title,
  name,
  action,
  hotkey,
}) => {
  const history = useHistory()
  const path = history.location.pathname.split('/')

  const [isActive, setIsActive] = React.useState(active || false)
  const isKeyPressed = hotkey ? useKeyIsPressed(hotkey.key) : false
  const isControlPressed = useKeyIsPressed(Keys.Control)

  useEffect(() => {
    if (isKeyPressed && isControlPressed) {
      action()
    }
  }, [isKeyPressed, isControlPressed])

  useEffect(() => {
    if (name === path[path.length - 1]) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [path])

  return (
    <TabStyled
      active={isActive}
      tabIndex={0}
      onClick={action}
      onKeyDown={(e) => e.keyCode === Keys.Enter.code && action()}
    >
      {title} {isControlPressed && hotkey ? hotkey.name : null}
    </TabStyled>
  )
}

/** Tabs list: */

const TabsWrapper = styled.ul<{ tabCount: number }>`
  width: 100%;

  margin: 0;
  list-style: none;
  padding: 0;

  display: grid;
  grid-template-columns: repeat(${({ tabCount }) => tabCount}, 1fr);
  column-gap: 10px;
`

export interface TabsProps {
  list: TabProps[]
}

export const Tabs: React.FC<TabsProps> = ({ list }) => {
  return (
    <TabsWrapper tabCount={list.length}>
      {list.map((tab) => (
        <Tab key={tab.name} {...tab} />
      ))}
    </TabsWrapper>
  )
}
