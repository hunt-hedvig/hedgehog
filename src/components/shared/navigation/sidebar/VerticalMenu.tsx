import { colorsV3 } from '@hedviginsurance/brand'
import React, { useContext, useState } from 'react'
import {
  BoxArrowLeft,
  ChevronLeft,
  House,
  Inbox,
  ListCheck,
  Search,
  ShieldShaded,
  Tools,
} from 'react-bootstrap-icons'
import styled from 'react-emotion'
import MediaQuery from 'react-media'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import actions from 'store/actions'
import { authLogOut, AuthState } from 'store/actions/auth'
import { BackofficeStore } from 'store/storeTypes'
import { DarkmodeContext } from 'utils/darkmode-context'
import { Logo } from './elements'

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

    [Menu as any]: {
      padding: collapsed ? '0 1rem' : '0 2rem',
    },
    [BottomSection as any]: {
      padding: collapsed ? '0 1rem' : '0 2rem',
    },
    [DarkmodeSwitch as any]: {
      display: collapsed ? 'none' : 'block',
    },
    [MenuItem as any]: {
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
  position: 'absolute',
  display: 'flex',
  flexDirection: 'column',
  top: 0,
  height: '100vh',
  width: '100%',
})

const Header = styled('div')({
  position: 'relative',
})

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
      transition: 'transform 200ms',
      transform: `rotate(${collapsed ? 180 : 0}deg)`,
      margin: 0,
      width: '0.75rem',
      height: '0.75rem',
    },
  }),
)

const HeaderLogo = styled(Logo)<{ collapsed: boolean }>(({ collapsed }) => ({
  width: '3rem !important',
  margin: '2rem',
  marginLeft: collapsed ? '1.5rem' : '2rem',
  transition: 'margin 200ms',
}))

const MenuGroup = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  paddingBottom: '4rem',
})

const MenuItem = styled(NavLink)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.5rem 1rem',
  margin: '0.5rem 0',
  color: '#fff !important',
  borderRadius: '0.5rem',
  transition: 'background 200ms, font-size 300ms, width 300ms',

  '&:hover, &:focus, &.active': {
    color: colorsV3.gray100 + ' !important',
    textDecoration: 'none',
    background: theme.type === 'dark' ? colorsV3.gray900 : colorsV3.gray700,
  },
  '&:hover:not(.active), &:focus:not(.active)': {
    background: colorsV3.gray900,
  },

  svg: {
    fill: colorsV3.gray100,
    marginRight: 16,
    textAlign: 'center',
    transition: 'width 300ms, weight 300ms, margin 300ms',
    flexShrink: 0,
  },
}))

const Menu = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
})

const MenuText = styled('div')({
  transition: 'width 200ms',
  whiteSpace: 'nowrap',
  overflowX: 'hidden',
})

const BottomSection = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  padding: '0 2rem 2rem 2rem',
  opacity: 0.5,
})

const DarkmodeSwitch = styled('label')(({ theme }) => ({
  display: 'inline-block',
  textAlign: 'center',
  marginTop: '1rem',
  padding: '0.5rem',
  fontSize: '0.8rem',
  borderRadius: 8,
  color: theme.background,
  backgroundColor: theme.foreground,
  border: theme.type === 'dark' ? '1px solid transparent' : '1px solid #fff',
  cursor: 'pointer',
}))
const DarkmodeInnerSwitch = styled('input')({
  width: 0,
  height: 0,
  visibility: 'hidden',
})

export const VerticalMenuComponent: React.FC<any & { history: History }> = ({
  authLogOut: authLogOut_,
  loginState,
  history,
}) => {
  const [isCollapsed, setCollapsed] = useState(
    () => localStorage.getItem('hedvig:menu:collapse') === 'true',
  )
  const [updateCount, setUpdateCount] = useState(0)
  const { isDarkmode, setIsDarkmode } = useContext(DarkmodeContext)

  const toggleOpen = () => {
    setCollapsed(!isCollapsed)
    localStorage.setItem('hedvig:menu:collapse', JSON.stringify(!isCollapsed))
  }
  const toggleDarkmode = () => {
    setIsDarkmode(!isDarkmode)
  }

  React.useEffect(() => {
    history.listen(() => {
      setUpdateCount(updateCount + 1)
    })
  }, [])

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
            </Header>

            <Menu>
              <MenuGroup>
                <MenuItem to="/dashboard">
                  <House />
                  <MenuText>Dashborad</MenuText>
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
                  <MenuText>Member Search</MenuText>
                </MenuItem>
              </MenuGroup>
              <MenuGroup>
                <MenuItem to="/questions">
                  <Inbox />
                  <MenuText>Questions</MenuText>
                </MenuItem>
                <MenuItem to="/claims">
                  <ShieldShaded />
                  <MenuText>Claims</MenuText>
                </MenuItem>
              </MenuGroup>
              <MenuGroup>
                <MenuItem to="/taskmanager">
                  <ListCheck />
                  <MenuText>Tickets</MenuText>
                </MenuItem>
                <MenuItem to="/tools">
                  <Tools />
                  <MenuText>Tools</MenuText>
                </MenuItem>
              </MenuGroup>
            </Menu>

            <BottomSection>
              <DarkmodeSwitch>
                <DarkmodeInnerSwitch
                  type="checkbox"
                  onChange={() => toggleDarkmode()}
                />
                {isDarkmode ? 'Regular H.OPE.' : 'Darkmode 👽'}
              </DarkmodeSwitch>
              <MenuItem
                onClick={(e) => {
                  e.preventDefault()
                  authLogOut_()
                }}
                to="#"
              >
                <BoxArrowLeft />
                <MenuText>
                  {loginState === AuthState.LOGOUT_LOADING ? '...' : 'Log out'}
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
