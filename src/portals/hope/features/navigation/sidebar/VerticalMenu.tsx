import styled from '@emotion/styled'
import { colorsV3 } from '@hedviginsurance/brand'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import React, { useEffect, useState } from 'react'
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
import { useHistory, useLocation } from 'react-router'
import { UserSettingKey } from 'types/generated/graphql'
import { Logo, LogoIcon } from './elements'
import { ExternalMenuItem, MenuItem } from './MenuItem'
import { Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useNavigation } from '@hedvig-ui/hooks/navigation/use-navigation'
import { CheckedInCard } from 'portals/hope/features/navigation/sidebar/CheckedInCard'

const Wrapper = styled.div<{ collapsed: boolean }>`
  display: inline-block;
  position: relative;
  flex: 1;

  background: ${({ theme }) =>
    theme.type === 'dark' ? colorsV3.gray800 : colorsV3.gray900};
  color: ${colorsV3.white};
  transition: max-width 300ms;
  max-width: ${({ collapsed }) => (collapsed ? '6rem' : '300px')};
  min-width: 6rem;

  min-height: 100vh;

  .menu {
    padding: ${({ collapsed }) => (collapsed ? '0 1rem' : '0 2rem')};
  }

  a {
    padding: ${({ collapsed }) => (collapsed ? '0.75rem 1rem' : undefined)};
    width: ${({ collapsed }) => (collapsed ? undefined : '100%')};
    justify-content: ${({ collapsed }) =>
      collapsed ? 'center' : 'flex-start'};

    svg {
      width: ${({ collapsed }) => (collapsed ? '24px' : '18px')};
      height: ${({ collapsed }) => (collapsed ? '24px' : '18px')};
      margin-right: ${({ collapsed }) => (collapsed ? 0 : '1rem')};
    }
  }
`

const InnerWrapper = styled.div`
  position: sticky;
  display: flex;
  flex-direction: column;
  top: 0;
  height: 100vh;
  overflow-y: scroll;
  width: 100%;
  margin: auto;

  &::-webkit-scrollbar {
    appearance: none;
    width: 0;
    display: none;
  }
`

const Header = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 2rem 0;
  flex-shrink: 0;
`

const HeaderLogo = styled(Logo)<{ collapsed: boolean }>`
  width: ${({ collapsed }) => (collapsed ? '0' : '7rem')};
  opacity: ${({ collapsed }) => (collapsed ? '0' : '1')};
  margin-right: 0;
  margin-left: ${({ collapsed }) => (collapsed ? '0' : '2rem')};
  transition: all 500ms;
  fill: ${colorsV3.gray100};
`

const HeaderLogoIcon = styled(LogoIcon)<{ collapsed: boolean }>`
  width: ${({ collapsed }) => (collapsed ? '2rem' : '1rem')};
  fill: ${colorsV3.gray100};
  transition: all 500ms;
`

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
    zIndex: 1001,

    '&& > *': {
      transition: 'transform 500ms',
      transform: `rotate(${collapsed ? 180 : 0}deg)`,
      margin: 0,
      width: '0.75rem',
      height: '0.75rem',
    },
  }),
)

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: fit-content;
`

const routes = {
  dashborad: '/dashborad',
  claims: '/claims/list/1',
  questions: '/tasks/check-in',
  conversations: '/conversations',
  search: '/members',
  tools: '/tools',
  trustly: 'https://backoffice.trustly.com/?Locale=en_GB#/tab_orders',
  adyen: 'https://ca-live.adyen.com',
  gsr: 'https://app.gsr.se/Account/SignIn',
  foss: 'https://foss.finansnorge.no/#/account/login',
}

export const VerticalMenu: React.FC = () => {
  const history = useHistory()
  const { settings } = useMe()
  const { pathname } = useLocation()
  const [isCollapsed, setCollapsed] = useState(
    () => localStorage.getItem('hedvig:menu:collapse') === 'true',
  )
  const [locations, setLocations] = useState<string[]>([])
  const [conversationsEnabled] = useState<boolean>(
    (settings[UserSettingKey.FeatureFlags] &&
      settings[UserSettingKey.FeatureFlags]?.conversations) ||
      false,
  )

  const { registerList } = useNavigation()

  useEffect(() => {
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
      title: 'Search',
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

  const { registerItem } = registerList({
    list: MenuItemsList,
    name: 'VerticalMenu',
    nameField: 'title',
    focus: Keys.S,
    resolve: (item) => item.hotkeyHandler(),
    focusCondition: (name) => {
      const itemTitle = name.split(' - ')[1]

      const route = MenuItemsList.find(
        (menuItem) => menuItem.title === itemTitle,
      )?.route

      if (history.location.pathname === '/' && route === routes.dashborad) {
        return true
      }

      if (
        history.location.pathname.includes('/claims') &&
        route === routes.claims
      ) {
        return true
      }

      return route ? history.location.pathname.includes(route) : false
    },
  })

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

            <Menu className="menu">
              {MenuItemsList.map((item) =>
                !item.external ? (
                  <MenuItem
                    key={item.route}
                    style={{
                      ...registerItem(item).style,
                      marginBottom: item.single ? '4rem' : 0,
                    }}
                    isActive={(_match, location) => {
                      if (
                        location.pathname.startsWith('/search') &&
                        item.route === '/members'
                      ) {
                        return true
                      }

                      if (
                        location.pathname === '/' &&
                        item.route === routes.dashborad
                      ) {
                        return true
                      }

                      if (
                        location.pathname.startsWith('/questions') &&
                        item.route === '/tasks/check-in'
                      ) {
                        return true
                      }

                      if (
                        location.pathname.startsWith('/claims') &&
                        item.route === '/claims/list/1'
                      ) {
                        return true
                      }

                      return location.pathname.startsWith(item.route)
                    }}
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
                    style={{
                      ...registerItem(item).style,
                      marginBottom: item.single ? '4rem' : 0,
                    }}
                    href={item.route}
                    shouldAlwaysCollapse={shouldAlwaysCollapse}
                    isCollapsed={isCollapsed}
                    {...item}
                  />
                ),
              )}
              {!isCollapsed && !shouldAlwaysCollapse && <CheckedInCard />}
            </Menu>
          </InnerWrapper>
        </Wrapper>
      )}
    </MediaQuery>
  )
}
