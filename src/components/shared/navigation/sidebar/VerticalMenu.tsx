import { colorsV3 } from '@hedviginsurance/brand'
import { Spacing } from 'hedvig-ui/spacing'
import React, { useContext, useState } from 'react'
import {
  ArrowUpRight,
  Backspace,
  BoxArrowLeft,
  ChevronLeft,
  CreditCard,
  CreditCard2Front,
  House,
  Inbox,
  PersonBoundingBox,
  Search,
  ShieldShaded,
  Tools,
} from 'react-bootstrap-icons'
import styled from 'react-emotion'
import MediaQuery from 'react-media'
import { connect } from 'react-redux'
import { matchPath } from 'react-router'
import { NavLink } from 'react-router-dom'
import actions from 'store/actions'
import { authLogOut, AuthState } from 'store/actions/auth'
import { BackofficeStore } from 'store/storeTypes'
import { DarkmodeContext } from 'utils/darkmode-context'
import { useCommandLine } from 'utils/hooks/command-line-hook'
import { KeyCode } from 'utils/hooks/key-press-hook'
import { Logo, LogoIcon } from './elements'

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
      padding: collapsed ? '1rem' : undefined,
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
    top: '4rem',
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

const MenuGroup = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flexShrink: 0,
  width: '100%',
  paddingBottom: '4rem',
})

const MenuItem = styled(NavLink)<{ transparent?: boolean }>(
  ({ theme, transparent = false }) => ({
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    padding: '0.5rem 1rem',
    margin: '0.5rem 0',
    color: '#fff !important',
    borderRadius: '0.5rem',
    transition: 'background 500ms, font-size 300ms, width 300ms',

    '&:hover, &:focus, &.active': {
      color: colorsV3.gray100 + ' !important',
      textDecoration: 'none',
      background: theme.type === 'dark' ? colorsV3.gray900 : colorsV3.gray700,
    },
    '&:hover:not(.active), &:focus:not(.active)': {
      background: colorsV3.gray900,
    },

    opacity: transparent ? 0.5 : 1,

    svg: {
      fill: colorsV3.gray100,
      marginRight: 16,
      textAlign: 'center',
      transition: 'width 300ms, weight 300ms, margin 300ms',
      flexShrink: 0,
    },
  }),
)
const MenuItemExternalLink = MenuItem.withComponent('a')

const Menu = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 'fit-content',
})

const MenuText = styled('div')({
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

const DarkmodeSwitch = styled('label')(({ theme }) => ({
  position: 'relative',
  display: 'inline-flex',
  justifyContent: 'center',
  flexShrink: 0,
  alignItems: 'center',
  marginTop: '1rem',
  padding: '0.75rem',
  fontSize: '1rem',
  lineHeight: 1,
  width: '3rem',
  borderRadius: 8,
  color: theme.background,
  backgroundColor: theme.foreground,
  border: theme.type === 'dark' ? '1px solid transparent' : '1px solid #fff',
  cursor: 'pointer',
}))
const DarkmodeInnerSwitch = styled('input')({
  position: 'absolute',
  width: 0,
  height: 0,
  visibility: 'hidden',
})

const routes = {
  dashborad: '/dashborad',
  claims: '/claims/list/1',
  questions: '/questions',
  search: '/members',
  tools: '/tools',
  trustly: 'https://backoffice.trustly.com/?Locale=en_GB#/tab_orders',
  adyen: 'https://ca-live.adyen.com',
  gsr: 'https://app.gsr.se/Account/SignIn',
}

interface LatestClaim {
  memberId: string
  claimId: string
  location: string
}

export const VerticalMenuComponent: React.FC<any & { history: History }> = ({
  authLogOut: authLogOut_,
  loginState,
  history,
}) => {
  const [isCollapsed, setCollapsed] = useState(
    () => localStorage.getItem('hedvig:menu:collapse') === 'true',
  )
  const [currentLocation, setCurrentLocation] = useState<string>(
    history.location.pathname,
  )
  const [locations, setLocations] = useState<string[]>([])
  const [latestClaim, setLatestClaim] = useState<LatestClaim | null>(null)
  const { isDarkmode, setIsDarkmode } = useContext(DarkmodeContext)

  const { useAction, isHinting } = useCommandLine()

  useAction([
    {
      label: 'Claims list',
      keysHint: ['⌥', 'C'],
      keys: [KeyCode.Option, KeyCode.C],
      onResolve: () => {
        history.push(routes.claims)
      },
    },
    {
      label: 'Tools',
      keysHint: ['⌥', 'T'],
      keys: [KeyCode.Option, KeyCode.T],
      onResolve: () => {
        history.push(routes.tools)
      },
    },
    {
      label: 'Questions',
      keysHint: ['⌥', 'Q'],
      keys: [KeyCode.Option, KeyCode.Q],
      onResolve: () => {
        history.push(routes.questions)
      },
    },
    {
      label: 'Member search',
      keysHint: ['⌥', 'S'],
      keys: [KeyCode.Option, KeyCode.S],
      onResolve: () => {
        history.push(routes.search)
      },
    },
    {
      label: 'Dashborad',
      keysHint: ['⌥', 'D'],
      keys: [KeyCode.Option, KeyCode.D],
      onResolve: () => {
        history.push(routes.dashborad)
      },
    },
    {
      label: 'Trustly',
      keysHint: ['⌥', 'R'],
      keys: [KeyCode.Option, KeyCode.R],
      onResolve: () => {
        window.open(routes.trustly)
      },
    },
    {
      label: 'Adyen',
      keysHint: ['⌥', 'A'],
      keys: [KeyCode.Option, KeyCode.A],
      onResolve: () => {
        window.open(routes.adyen)
      },
    },
    {
      label: 'GSR',
      keysHint: ['⌥', 'G'],
      keys: [KeyCode.Option, KeyCode.G],
      onResolve: () => {
        window.open(routes.gsr)
      },
    },
    {
      label: 'Logout',
      keysHint: ['⌥', 'L'],
      keys: [KeyCode.Option, KeyCode.L],
      onResolve: () => {
        authLogOut_()
      },
    },
    {
      label: 'Latest claim',
      keysHint: ['⌥', '←'],
      keys: [KeyCode.Option, KeyCode.Backspace],
      onResolve: () => {
        if (!latestClaim) {
          return
        }
        history.push(latestClaim.location)
      },
    },
  ])

  React.useEffect(() => {
    history.listen((location) => {
      setCurrentLocation(location.pathname)
    })
  }, [])

  React.useEffect(() => {
    const latestLocations = [currentLocation, ...locations]
    const newLocations = latestLocations.filter((_, index) => index < 10)
    setLocations(newLocations)
  }, [currentLocation])

  React.useEffect(() => {
    locations.find((location) => {
      const match = matchPath(location, {
        path: '/claims/:claimId/members/:memberId',
        exact: true,
        strict: false,
      })

      if (!match) {
        return
      }

      const { memberId, claimId } = match.params as LatestClaim

      setLatestClaim({
        memberId,
        claimId,
        location,
      })
    })
  }, [locations])

  const toggleOpen = () => {
    setCollapsed(!isCollapsed)
    localStorage.setItem('hedvig:menu:collapse', JSON.stringify(!isCollapsed))
  }
  const toggleDarkmode = () => {
    setIsDarkmode(!isDarkmode)
  }

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
              <MenuGroup>
                <MenuItem
                  to="/dashborad"
                  isActive={(_match, location) =>
                    location.pathname.startsWith('/dashborad')
                  }
                >
                  <House />
                  <MenuText>Dashborad {isHinting && '(D)'}</MenuText>
                </MenuItem>
              </MenuGroup>
              <MenuGroup>
                <MenuItem
                  to="/members"
                  isActive={(_match, location) =>
                    location.pathname.startsWith('/members')
                  }
                >
                  <Search />
                  <MenuText>Member Search {isHinting && '(S)'}</MenuText>
                </MenuItem>
              </MenuGroup>
              <MenuGroup>
                <MenuItem
                  to={routes.questions}
                  isActive={(_match, location) =>
                    location.pathname.startsWith('/questions')
                  }
                >
                  <Inbox />
                  <MenuText>Questions {isHinting && '(Q)'}</MenuText>
                </MenuItem>
                <MenuItem
                  to={routes.claims}
                  isActive={(_match, location) =>
                    location.pathname.startsWith('/claims')
                  }
                >
                  <ShieldShaded />
                  {isCollapsed && <MenuText>Claims</MenuText>}
                  {!isCollapsed && (
                    <Spacing right inline>
                      <MenuText>Claims {isHinting && '(C)'}</MenuText>
                    </Spacing>
                  )}
                  {isHinting && latestClaim && <Backspace />}
                </MenuItem>
              </MenuGroup>
              <MenuGroup>
                <MenuItem to={routes.tools}>
                  <Tools />
                  <MenuText>Tools {isHinting && '(T)'}</MenuText>
                </MenuItem>
              </MenuGroup>

              <MenuGroup>
                <MenuItemExternalLink href={routes.trustly} target="_blank">
                  <ArrowUpRight />
                  <CreditCard />
                  <MenuText>Trustly {isHinting && '(R)'}</MenuText>
                </MenuItemExternalLink>
                <MenuItemExternalLink href={routes.adyen} target="_blank">
                  <ArrowUpRight />
                  <CreditCard2Front />
                  <MenuText>Adyen {isHinting && '(A)'}</MenuText>
                </MenuItemExternalLink>
                <MenuItemExternalLink href={routes.gsr} target="_blank">
                  <ArrowUpRight />
                  <PersonBoundingBox />
                  <MenuText>GSR {isHinting && '(G)'}</MenuText>
                </MenuItemExternalLink>
              </MenuGroup>
            </Menu>

            <BottomSection>
              <DarkmodeSwitch>
                <DarkmodeInnerSwitch
                  type="checkbox"
                  onChange={() => toggleDarkmode()}
                />
                {isDarkmode ? '🌞' : '🌚'}
              </DarkmodeSwitch>
              <MenuItem
                onClick={(e) => {
                  e.preventDefault()
                  authLogOut_()
                }}
                to="#"
                transparent
              >
                <BoxArrowLeft />
                <MenuText>
                  {loginState === AuthState.LOGOUT_LOADING ? '...' : 'Logout'}{' '}
                  {isHinting && '(L)'}
                </MenuText>
              </MenuItem>
            </BottomSection>
          </InnerWrapper>
        </Wrapper>
      )}
    </MediaQuery>
  )
}

export const VerticalMenu = connect(
  (state) => ({
    loginState: (state as BackofficeStore).auth.state,
  }),
  {
    authLogOut,
    ...actions.clientActions,
  },
  null,
  { pure: false },
)(VerticalMenuComponent)
