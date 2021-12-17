import styled from '@emotion/styled'
import { HotkeyStyled } from '@hedvig-ui'
import { useArrowKeyboardNavigation } from '@hedvig-ui/hooks/keyboard/use-arrow-keyboard-navigation'
import React, { useEffect, useRef } from 'react'
import {
  isPressing,
  Key,
  Keys,
  useKeyIsPressed,
} from '../hooks/keyboard/use-key-is-pressed'
import { useElementFocus } from '@hedvig-ui/hooks/use-element-focus'

const TabStyled = styled.li<{ active?: boolean; focused?: boolean }>`
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

  ${({ active, theme, focused }) => `
    border-bottom: 1px solid ${
      focused ? theme.foreground : !active ? theme.accentLighter : theme.accent
    };
    color: ${
      focused
        ? theme.accent
        : !active
        ? theme.semiStrongForeground
        : theme.foreground
    };
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
  focused?: boolean
  action: () => void
  title: string
  hotkey?: {
    name: string
    key: Key
  }
}

export const Tab: React.FC<TabProps> = ({
  focused,
  active,
  title,
  action,
  hotkey,
  ...props
}) => {
  const isKeyPressed = hotkey ? useKeyIsPressed(hotkey.key) : false // TODO: Rename back
  const isControlPressed = useKeyIsPressed(Keys.Control)

  useEffect(() => {
    if (isKeyPressed && isControlPressed) {
      action()
    }
  }, [isKeyPressed, isControlPressed])

  return (
    <TabStyled
      active={active}
      focused={focused}
      tabIndex={0}
      onClick={action}
      onKeyDown={(e) => isPressing(e, Keys.Enter) && action()}
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
  navigationAvailable?: boolean
}

export const Tabs: React.FC<TabsProps> = ({
  list,
  navigationAvailable,
  ...props
}) => {
  const tabsRef = useRef<HTMLUListElement>(null)

  const [navigationStep] = useArrowKeyboardNavigation({
    maxStep: list.length - 2,
    isActive: navigationAvailable,
    onPerformNavigation: (index) => {
      const currentTab = index + 1
      list[currentTab].action()
    },
    direction: 'horizontal',
    withNegative: true,
  })

  useElementFocus(tabsRef, navigationAvailable || false)

  return (
    <TabsWrapper tabCount={list.length} ref={tabsRef} {...props}>
      {list.map((tab, index) => (
        <Tab
          key={tab.title}
          focused={navigationAvailable && navigationStep === index - 1}
          {...tab}
        />
      ))}
    </TabsWrapper>
  )
}
