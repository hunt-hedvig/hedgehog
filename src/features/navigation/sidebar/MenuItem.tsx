import styled, { StyledComponent } from '@emotion/styled'
import { colorsV3 } from '@hedviginsurance/brand'
import React, { useRef } from 'react'
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

  &.active,
  &:focus {
    background: ${({ theme }) =>
      theme.type === 'dark' ? colorsV3.gray900 : colorsV3.gray700};
  }

  &:focus.active {
    background: ${colorsV3.gray500};
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
}

export const MenuItem: React.FC<MenuItemProps> = ({
  title,
  to,
  icon,
  hotkey,
  shouldAlwaysCollapse,
  isCollapsed,
  hotkeyHandler,
  ...props
}) => {
  const itemRef = useRef<HTMLAnchorElement>(null)
  const ItemIcon = icon

  return (
    <MenuItemStyled innerRef={itemRef} to={to} {...props}>
      <ItemIcon />
      {!(shouldAlwaysCollapse || isCollapsed) && title}
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
  ...props
}) => {
  const itemRef = useRef<HTMLAnchorElement>(null)
  const ItemIcon = icon

  return (
    <MenuItemExternalLink ref={itemRef} href={href} target="_blank" {...props}>
      {!(shouldAlwaysCollapse || isCollapsed) && <ArrowUpRight />}
      <ItemIcon />
      {!(shouldAlwaysCollapse || isCollapsed) && title}
    </MenuItemExternalLink>
  )
}
