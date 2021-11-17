import styled from '@emotion/styled'
import { colorsV3 } from '@hedviginsurance/brand'
import { useMe } from 'features/user/hooks/use-me'
import React, { useState } from 'react'
import {
  Chat,
  ChevronLeft,
  CreditCard,
  CreditCard2Front,
  House,
  Inbox,
  PersonBoundingBox,
  PersonSquare,
  Search,
  ShieldShaded,
  Tools,
} from 'react-bootstrap-icons'
import MediaQuery from 'react-media'
import { useLocation } from 'react-router'
import { UserSettingKey } from 'types/generated/graphql'
import { Logo, LogoIcon } from './elements'
import { ExternalMenuItem, MenuItem } from './MenuItem'

const Wrapper = styled('div')<{ collapsed: boolean }>(
  ({ collapsed, theme }) => ({
    display: 'inline-block',
    position: 'relative',
    flex: 1,
    background: theme.type === 'dark' ? colorsV3.gray800 : colorsV3.gray900,
    color: colorsV3.white,
    transition: 'max-width 300ms',
    maxWidth: collapsed ? '6rem' : 300,
    minWidth: '6rem',
    minHeight: '100vh',

    [Menu as any]: {
      padding: collapsed ? '0 1rem' : '0 2rem',
    },
    [BottomSection as any]: {
      padding: collapsed ? '0 1rem' : '0 2rem',
      alignItems: collapsed ? 'center' : 'flex-start',
    },
    a: {
      padding: collapsed ? '0.75rem 1rem' : undefined,
      width: collapsed ? undefined : '100%',
      justifyContent: collapsed ? 'center' : 'flex-start',

      svg: {
        width: collapsed ? 24 : 18,
        height: collapsed ? 24 : 18,
        marginRight: collapsed ? 0 : '1rem',
      },
    },
    [MenuText as any]: {
      width: collapsed ? 0 : 'auto',
    },
  }),
)
const InnerWrapper = styled('div')({
  position: 'sticky',
  display: 'flex',
  flexDirection: 'column',
  top: 0,
  height: '100vh',
  overflowY: 'scroll',
  width: '100%',
  margin: 'auto',

  '&::-webkit-scrollbar, &::-moz-scrollbar': {
    appearance: 'none',
    width: 0,
    display: 'none',
  },
})

const Header = styled('div')({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '2rem 0',
  flexShrink: 0,
})
const HeaderLogo = styled(Logo)<{ collapsed: boolean }>(({ collapsed }) => ({
  width: collapsed ? 0 : '7rem',
  opacity: collapsed ? 0 : 1,
  marginRight: 0,
  marginLeft: collapsed ? 0 : '2rem',
  transition: 'margin 500ms, width 500ms, opacity: 500ms',
  fill: colorsV3.gray100,
}))
const HeaderLogoIcon = styled(LogoIcon)<{ collapsed: boolean }>(
  ({ collapsed }) => ({
    width: collapsed ? '2rem' : '1rem',
    fill: colorsV3.gray100,
    transition: 'margin-left 500ms, width 500ms',
  }),
)

const CollapseToggle = styled('button')<{ collapsed?: boolean }>(
  ({ collapsed, theme }) => ({
    background: theme.type === 'dark' ? colorsV3.gray800 : colorsV3.gray900,
    height: 'calc(0.75rem + 1.5rem)',
    width: '1.5rem',
    position: 'absolute',
    top: '1rem',
    transform: 'translateX(100%)',
    right: 0,
    color: '#fff',
    borderTopRightRadius: '0.5rem',
    borderBottomRightRadius: '0.5rem',
    padding: 0,
    border: 0,
    borderLeftColor: 'transparent',

    '&& > *': {
      transition: 'transform 500ms',
      transform: `rotate(${collapsed ? 180 : 0}deg)`,
      margin: 0,
      width: '0.75rem',
      height: '0.75rem',
    },
  }),
)

const Menu = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 'fit-content',
})

const MenuText = styled('div')({
  display: 'flex',
  alignItems: 'center',
  transition: 'width 500ms',
  whiteSpace: 'nowrap',
  overflowX: 'hidden',
})

const BottomSection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '0 2rem 2rem 2rem',
})

const routes = {
  dashborad: '/dashborad',
  claims: '/claims/list/1',
  questions: '/questions',
  conversations: '/conversations',
  search: '/members',
  tools: '/tools',
  trustly: 'https://backoffice.trustly.com/?Locale=en_GB#/tab_orders',
  adyen: 'https://ca-live.adyen.com',
  gsr: 'https://app.gsr.se/Account/SignIn',
  foss: 'https://foss.finansnorge.no/#/account/login',
}

export const VerticalMenu: React.FC<any & { history: History }> = ({
  history,
}) => {
  const { settings } = useMe()
  const { pathname } = useLocation()
  const [isCollapsed, setCollapsed] = useState(
    () => localStorage.getItem('hedvig:menu:collapse') === 'true',
  )
  const [locations, setLocations] = useState<string[]>([])
  const [conversationsEnabled] = useState<boolean>(
    settings[UserSettingKey.FeatureFlags]?.conversations || false,
  )

  React.useEffect(() => {
    const latestLocations = [pathname, ...locations].filter(
      (_, index) => index < 10,
    )
    setLocations(latestLocations)
  }, [pathname])

  const toggleOpen = () => {
    setCollapsed(!isCollapsed)
    localStorage.setItem('hedvig:menu:collapse', JSON.stringify(!isCollapsed))
  }

  const MenuItemsList = [
    {
      route: routes.dashborad,
      icon: House,
      hotkey: 'D',
      title: 'Dashborad',
      single: true,
      external: false,
      hotkeyHandler: () => history.push(routes.dashborad),
    },
    {
      route: routes.search,
      icon: Search,
      hotkey: 'S',
      title: 'Member Search',
      single: true,
      external: false,
      hotkeyHandler: () => history.push(routes.search),
    },
    {
      route: conversationsEnabled ? routes.conversations : routes.questions,
      icon: conversationsEnabled ? Chat : Inbox,
      hotkey: 'Q',
      title: conversationsEnabled ? 'Conversations' : 'Questions',
      single: false,
      external: false,
      hotkeyHandler: () =>
        history.push(
          conversationsEnabled ? routes.conversations : routes.questions,
        ),
    },
    {
      route: routes.claims,
      icon: ShieldShaded,
      hotkey: 'C',
      title: 'Claims',
      single: true,
      external: false,
      hotkeyHandler: () => history.push(routes.claims),
    },
    {
      route: routes.tools,
      icon: Tools,
      hotkey: 'T',
      title: 'Tools',
      single: true,
      external: false,
      hotkeyHandler: () => history.push(routes.tools),
    },
    {
      route: routes.trustly,
      icon: CreditCard,
      hotkey: 'R',
      title: 'Trustly',
      single: false,
      external: true,
      hotkeyHandler: () => window.open(routes.trustly),
    },
    {
      route: routes.adyen,
      icon: CreditCard2Front,
      hotkey: 'A',
      title: 'Adyen',
      single: false,
      external: true,
      hotkeyHandler: () => window.open(routes.adyen),
    },
    {
      route: routes.gsr,
      icon: PersonBoundingBox,
      hotkey: 'G',
      title: 'GSR',
      single: false,
      external: true,
      hotkeyHandler: () => window.open(routes.gsr),
    },
    {
      route: routes.foss,
      icon: PersonSquare,
      hotkey: 'F',
      title: 'FOSS',
      single: true,
      external: true,
      hotkeyHandler: () => window.open(routes.foss),
    },
  ]

  return (
    <MediaQuery query="(max-width: 1300px)">
      {(shouldAlwaysCollapse) => (
        <Wrapper collapsed={shouldAlwaysCollapse || isCollapsed}>
          <CollapseToggle
            onClick={toggleOpen}
            collapsed={shouldAlwaysCollapse || isCollapsed}
          >
            <ChevronLeft />
          </CollapseToggle>

          <InnerWrapper>
            <Header>
              <HeaderLogo collapsed={shouldAlwaysCollapse || isCollapsed} />
              <HeaderLogoIcon collapsed={shouldAlwaysCollapse || isCollapsed} />
            </Header>

            <Menu>
              {MenuItemsList.map(({ external, single, ...item }) =>
                !external ? (
                  <MenuItem
                    key={item.route}
                    style={{ marginBottom: single ? '4rem' : 0 }}
                    isActive={(_match, location) =>
                      location.pathname.startsWith(item.route)
                    }
                    to={
                      item.route !== routes.claims
                        ? item.route
                        : { pathname: routes.claims, state: { from: 'menu' } }
                    }
                    shouldAlwaysCollapse={shouldAlwaysCollapse}
                    isCollapsed={isCollapsed}
                    {...item}
                  />
                ) : (
                  <ExternalMenuItem
                    key={item.route}
                    style={{ marginBottom: single ? '4rem' : 0 }}
                    href={item.route}
                    shouldAlwaysCollapse={shouldAlwaysCollapse}
                    isCollapsed={isCollapsed}
                    {...item}
                  />
                ),
              )}
            </Menu>
          </InnerWrapper>
        </Wrapper>
      )}
    </MediaQuery>
  )
}
