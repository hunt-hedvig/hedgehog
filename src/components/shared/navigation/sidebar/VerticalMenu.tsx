import { colors } from '@hedviginsurance/brand'
import * as React from 'react'
import styled from 'react-emotion'
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'
import actions from 'store/actions'
import { Logo } from './elements'

const Wrapper = styled('div')(({ collapsed }: { collapsed: boolean }) => ({
  flex: 1,
  background: colors.OFF_BLACK_DARK,
  color: '#fff',
  overflowX: 'hidden',
  transition: 'max-width 300ms',
  maxWidth: collapsed ? 16 * 3 : 250,
  minWidth: 16 * 3,
}))
const InnerWrapper = styled('div')({
  position: 'sticky',
  top: 0,
})

const Header = styled('div')({
  position: 'relative',
  paddingRight: 32,
})

const CollapseToggle = styled('button')(
  ({ collapsed }: { collapsed?: boolean }) => ({
    background: 'transparent',
    height: 30 + 16 * 2,
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    right: 16,
    fontSize: 20,
    color: '#fff',
    border: 0,
    '> *': {
      transition: 'transform 200ms',
      transform: `rotate(${collapsed ? 180 : 0}deg)`,
    },
  }),
)

const HeaderLogo = styled(Logo)(({ collapsed }: { collapsed?: boolean }) => ({
  maxWidth: 100,
  margin: '32px 16px',
  opacity: collapsed ? 0 : 1,
  transition: 'opacity 200ms',
}))

const Menu = styled('div')({
  display: 'flex',
  flexDirection: 'column',
})

const MenuItem = styled(NavLink)({
  display: 'flex',
  alignItems: 'center',
  padding: 16,
  borderBottom: '1px solid #fff',
  borderTop: '1px solid #fff',
  marginBottom: -1,
  color: '#fff',
  fontSize: 18,

  '&:hover, &:focus, &.active': {
    background: colors.DARK_PURPLE,
    color: '#fff',
    textDecoration: 'none',
  },
})

const MenuIcon = styled('i')({
  color: '#fff',
  fontSize: 16,
  marginRight: 8,
  width: 16,
  textAlign: 'center',
})

const MenuText = styled('div')(({ collapsed }: { collapsed?: boolean }) => ({
  maxWidth: collapsed ? 0 : '100%',
  opacity: collapsed ? 0 : 1,
  transition: 'max-width: 200ms, opacity 200ms',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
}))

export class VerticalMenuComponent extends React.Component<
  any,
  { isCollapsed: boolean }
> {
  public state = {
    isCollapsed: localStorage.getItem('hedvig:menu:collapse') === 'true',
  }

  public render() {
    return (
      <Wrapper collapsed={this.state.isCollapsed}>
        <InnerWrapper>
          <Header>
            <HeaderLogo collapsed={this.state.isCollapsed} />

            <CollapseToggle
              onClick={this.toggleOpen}
              collapsed={this.state.isCollapsed}
            >
              <i className="fa fa-chevron-left" />
            </CollapseToggle>
          </Header>

          <Menu>
            <MenuItem to="/dashboard">
              <MenuIcon className="fa fa-skull-crossbones" />
              <MenuText collapsed={this.state.isCollapsed}>Dashborad</MenuText>
            </MenuItem>
            <MenuItem
              to="/members"
              isActive={(_match, location) =>
                location.pathname.startsWith('/members')
              }
            >
              <MenuIcon className="fa fa-users" />
              <MenuText collapsed={this.state.isCollapsed}>Members</MenuText>
            </MenuItem>
            <MenuItem to="/member_insurance">
              <MenuIcon className="fa fa-list" />
              <MenuText collapsed={this.state.isCollapsed}>
                Member Insurance
              </MenuText>
            </MenuItem>
            <MenuItem to="/questions">
              <MenuIcon className="fa fa-question" />
              <MenuText collapsed={this.state.isCollapsed}>Questions</MenuText>
            </MenuItem>
            <MenuItem to="/claims">
              <MenuIcon className="fa fa-exclamation" />
              <MenuText collapsed={this.state.isCollapsed}>Claims</MenuText>
            </MenuItem>
            <MenuItem to="/tools">
              <MenuIcon className="fa fa-toolbox" />
              <MenuText collapsed={this.state.isCollapsed}>Tools</MenuText>
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                e.preventDefault()
                this.props.unsetClient()
              }}
              to="#"
            >
              <MenuIcon className="fa fa-sign-out-alt" />
              <MenuText collapsed={this.state.isCollapsed}>Log out</MenuText>
            </MenuItem>
          </Menu>
        </InnerWrapper>
      </Wrapper>
    )
  }

  private toggleOpen = () => {
    this.setState(
      ({ isCollapsed }) => ({ isCollapsed: !isCollapsed }),
      () => {
        localStorage.setItem(
          'hedvig:menu:collapse',
          JSON.stringify(this.state.isCollapsed),
        )
      },
    )
  }
}

export const VerticalMenu = connect(
  null,
  { ...actions.clientActions },
)(VerticalMenuComponent)
