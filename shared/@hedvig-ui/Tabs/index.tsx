import styled from '@emotion/styled'
import { HotkeyStyled } from '@hedvig-ui'
import React, { useEffect } from 'react'
import {
  isPressing,
  Key,
  Keys,
  useKeyIsPressed,
} from '../hooks/keyboard/use-key-is-pressed'
import { useNavigation } from '../hooks/navigation/use-navigation'
import { lightTheme } from '../themes'

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
  withMetaKey?: boolean
}

export const Tabs: React.FC<TabsProps> = ({ list, withMetaKey, ...props }) => {
  const { register } = useNavigation()

  return (
    <TabsWrapper tabCount={list.length} {...props}>
      {list.map((tab, index) => {
        const tabNavigation = register(
          `Tab - ${tab.title}`,
          {
            // The active tab is not updated after action
            // focus: tab.active ? Keys.T : undefined,
            focus: Keys.T,
            resolve: () => {
              tab.action()
            },
            neighbors: {
              left: index ? `Tab - ${list[index - 1].title}` : undefined,
              right:
                index < list.length - 1
                  ? `Tab - ${list[index + 1].title}`
                  : undefined,
            },
            metaKey: withMetaKey ? 'shiftKey' : undefined,
          },
          {
            border: `1px solid ${lightTheme.accent}`,
          },
          {
            borderWidth: '1px',
            borderBottom: `1px solid ${
              tab.active ? lightTheme.accent : lightTheme.accentLight
            }`,
          },
        )

        return <Tab key={tab.title} {...tab} {...tabNavigation} />
      })}
    </TabsWrapper>
  )
}
