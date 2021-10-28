import styled from '@emotion/styled'
import { HotkeyStyled } from '@hedvig-ui'
import React, { useEffect } from 'react'
import {
  Key,
  Keys,
  useKeyIsPressed,
} from '../hooks/keyboard/use-key-is-pressed'

const TabStyled = styled.li<{ active?: boolean }>`
  transition: all 0.3s;
  position: relative;

  width: 100%;

  font-size: 14px;
  list-style: none;
  outline: none;
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;

  padding: 5px 0;
  margin: 0;

  ${({ active, theme }) => `
    border-bottom: 1px solid ${!active ? theme.accentLighter : theme.accent};
    color: ${!active ? theme.semiStrongForeground : theme.foreground};
  `}

  &:hover,
  &:focus {
    border-bottom: 1px solid ${({ theme }) => theme.accent};
    color: ${({ theme }) => theme.foreground};
  }
`

const HotkeyWrapper = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;

  left: 0;
  top: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
`

const Hotkey = styled(HotkeyStyled)`
  font-size: 11px;

  width: 18px;
  height: 18px;

  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  position: static;
`

export interface TabProps extends React.HTMLAttributes<HTMLLIElement> {
  active?: boolean
  action: () => void
  title: string
  hotkey?: {
    name: string
    key: Key
  }
}

export const Tab: React.FC<TabProps> = ({
  active,
  title,
  action,
  hotkey,
  ...props
}) => {
  const isKeyPressed = hotkey ? useKeyIsPressed(hotkey.key) : false
  const isControlPressed = useKeyIsPressed(Keys.Control)

  useEffect(() => {
    if (isKeyPressed && isControlPressed) {
      action()
    }
  }, [isKeyPressed, isControlPressed])

  return (
    <TabStyled
      active={active}
      tabIndex={0}
      onClick={action}
      onKeyDown={(e) => e.keyCode === Keys.Enter.code && action()}
      {...props}
    >
      {title}{' '}
      {isControlPressed && hotkey ? (
        <HotkeyWrapper>
          <Hotkey dark>{hotkey.name}</Hotkey>
        </HotkeyWrapper>
      ) : null}
    </TabStyled>
  )
}

const TabsWrapper = styled.ul<{ tabCount: number }>`
  width: 100%;

  margin: 0;
  list-style: none;
  padding: 0;

  display: grid;
  grid-template-columns: repeat(${({ tabCount }) => tabCount}, 1fr);
`

export interface TabsProps extends React.HTMLAttributes<HTMLUListElement> {
  list: TabProps[]
}

export const Tabs: React.FC<TabsProps> = ({ list, ...props }) => {
  return (
    <TabsWrapper tabCount={list.length} {...props}>
      {list.map((tab) => (
        <Tab key={tab.title} {...tab} />
      ))}
    </TabsWrapper>
  )
}
