import styled, { StyledComponent } from '@emotion/styled'
import { colorsV3 } from '@hedviginsurance/brand'
import React from 'react'
import { ArrowUpRight, Icon } from 'react-bootstrap-icons'
import { NavLink, NavLinkProps } from 'react-router-dom'
import { useCommandLine } from 'portals/hope/features/commands/use-command-line'
import { Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { Hotkey } from '@hedvig-ui'

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

  &:hover,
  &:focus,
  &.active {
    color: ${() => colorsV3.gray100} !important;
    text-decoration: none;
    background: ${({ theme }) =>
      theme.type === 'dark' ? colorsV3.gray900 : colorsV3.gray700};
  }
  &:hover:not(.active),
  &:focus:not(.active) {
    background: ${() => colorsV3.gray900};
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
  shouldAlwaysCollapse: boolean
  isCollapsed: boolean
  transparent?: boolean
  hotkey: string
  hotkeyHandler: () => void
}

interface ExternalMenuItemProps
  extends React.HTMLAttributes<HTMLAnchorElement> {
  title: string
  href: string
  icon: Icon
  shouldAlwaysCollapse: boolean
  isCollapsed: boolean
  hotkey: string
  hotkeyHandler: () => void
}

export const MenuItem: React.FC<MenuItemProps> = ({
  title,
  to,
  icon,
  shouldAlwaysCollapse,
  isCollapsed,
  hotkey,
  hotkeyHandler,
  ...props
}) => {
  const { registerActions, isHintingOption } = useCommandLine()

  registerActions([
    {
      label: title,
      keys: [Keys.Option, Keys[hotkey]],
      onResolve: hotkeyHandler,
    },
  ])

  const ItemIcon = icon

  return (
    <MenuItemStyled to={to} {...props}>
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
  shouldAlwaysCollapse,
  isCollapsed,
  hotkey,
  hotkeyHandler,
  ...props
}) => {
  const { registerActions, isHintingOption } = useCommandLine()

  registerActions([
    {
      label: title,
      keys: [Keys.Option, Keys[hotkey]],
      onResolve: hotkeyHandler,
    },
  ])

  const ItemIcon = icon

  return (
    <MenuItemExternalLink
      href={href}
      target="_blank"
      {...props}
      rel="noreferrer"
    >
      {!(shouldAlwaysCollapse || isCollapsed) && <ArrowUpRight />}
      <ItemIcon />
      <Hotkey hotkey={hotkey} hinting={isHintingOption}>
        {!(shouldAlwaysCollapse || isCollapsed) && title}
      </Hotkey>
    </MenuItemExternalLink>
  )
}
