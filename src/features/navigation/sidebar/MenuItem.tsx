import styled, { StyledComponent } from '@emotion/styled'
import { Hotkey } from '@hedvig-ui'
import { Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { colorsV3 } from '@hedviginsurance/brand'
import { useCommandLine } from 'features/commands/use-command-line'
import React, { useEffect, useRef } from 'react'
import { ArrowUpRight, Icon } from 'react-bootstrap-icons'
import { NavLink, NavLinkProps } from 'react-router-dom'

interface WithTransparent {
  transparent?: boolean
}

const MenuItemStyled = styled<
  React.ComponentType<NavLinkProps & WithTransparent>
>(NavLink)`
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  padding: 0.5rem 1rem;
  margin: 0.5rem 0;
  color: #fff !important;
  border-radius: 0.5rem;
  transition: background 500ms, font-size 300ms, width 300ms;

  &.active {
    background: ${({ theme }) =>
      theme.type === 'dark' ? colorsV3.gray900 : colorsV3.gray700};
  }

  &:focus {
    background: ${({ theme }) => theme.accent};
  }

  opacity: ${({ transparent }) => (transparent ? 0.5 : 1)};

  svg {
    fill: ${() => colorsV3.gray100};
    margin-right: 16px;
    text-align: center;
    transition: width 300ms, weight 300ms, margin 300ms;
    flex-shrink: 0;
  }
`

const MenuItemExternalLink = MenuItemStyled.withComponent(
  'a',
) as StyledComponent<
  React.DetailedHTMLProps<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  >
>

interface MenuItemProps extends NavLinkProps {
  title: string
  icon: Icon
  hotkey: string
  shouldAlwaysCollapse: boolean
  isCollapsed: boolean
  hotkeyHandler: () => void
  transparent?: boolean
  focus: boolean
}

interface ExternalMenuItemProps
  extends React.HTMLAttributes<HTMLAnchorElement> {
  title: string
  href: string
  icon: Icon
  hotkey: string
  shouldAlwaysCollapse: boolean
  isCollapsed: boolean
  hotkeyHandler: () => void
  focus: boolean
}

export const MenuItem: React.FC<MenuItemProps> = ({
  title,
  to,
  icon,
  hotkey,
  shouldAlwaysCollapse,
  isCollapsed,
  hotkeyHandler,
  focus,
  ...props
}) => {
  const itemRef = useRef<HTMLAnchorElement>(null)
  const { registerActions, isHintingOption } = useCommandLine()

  registerActions([
    {
      label: title,
      keys: [Keys.Option, Keys[hotkey]],
      onResolve: hotkeyHandler,
    },
  ])

  const ItemIcon = icon

  useEffect(() => {
    if (itemRef?.current) {
      if (focus) {
        itemRef.current.focus()
      } else {
        itemRef.current.blur()
      }
    }
  }, [focus])

  return (
    <MenuItemStyled innerRef={itemRef} to={to} {...props}>
      <ItemIcon />
      <Hotkey hotkey={hotkey} hinting={isHintingOption}>
        {!(shouldAlwaysCollapse || isCollapsed) && title}
      </Hotkey>
    </MenuItemStyled>
  )
}

export const ExternalMenuItem: React.FC<ExternalMenuItemProps> = ({
  title,
  href,
  icon,
  hotkey,
  shouldAlwaysCollapse,
  isCollapsed,
  hotkeyHandler,
  focus,
  ...props
}) => {
  const itemRef = useRef<HTMLAnchorElement>(null)
  const { isHintingOption, registerActions } = useCommandLine()

  registerActions([
    {
      label: title,
      keys: [Keys.Option, Keys[hotkey]],
      onResolve: hotkeyHandler,
    },
  ])

  const ItemIcon = icon

  useEffect(() => {
    if (itemRef?.current) {
      if (focus) {
        itemRef.current.focus()
      } else {
        itemRef.current.blur()
      }
    }
  }, [focus])

  return (
    <MenuItemExternalLink ref={itemRef} href={href} target="_blank" {...props}>
      {!(shouldAlwaysCollapse || isCollapsed) && <ArrowUpRight />}
      <ItemIcon />
      <Hotkey hotkey={hotkey} hinting={isHintingOption}>
        {!(shouldAlwaysCollapse || isCollapsed) && title}
      </Hotkey>
    </MenuItemExternalLink>
  )
}
