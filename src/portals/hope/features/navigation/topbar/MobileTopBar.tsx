import styled from '@emotion/styled'
import React, { useState } from 'react'
import { CircleButton } from 'portals/hope/features/navigation/topbar/TopBar'
import {
  CreditCard,
  CreditCard2Front,
  GearFill,
  House,
  Inbox,
  List,
  PersonBoundingBox,
  PersonSquare,
  Search,
  ShieldShaded,
  Tools,
  X,
} from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import { Flex } from '@hedvig-ui'
import {
  ExternalMenuItem,
  MenuItem,
} from 'portals/hope/features/navigation/sidebar/MenuItem'
import { CheckedInCard } from 'portals/hope/features/navigation/sidebar/CheckedInCard'

const Wrapper = styled.div`
  z-index: 1000;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
  background-color: ${({ theme }) => theme.background};
  box-shadow: 1px 5px 20px rgba(0, 0, 0, 0.1);
  width: 100%;
  height: 4.5rem;
  padding: 1rem 1.5rem;
`

const Menu = styled.div`
  z-index: 1001;
  position: absolute;
  top: 0;
  left: 0;

  display: flex;
  flex-direction: column;

  height: 100vh;
  width: 100%;

  padding: 1.5rem 2rem;

  background-color: ${({ theme }) => theme.foreground};

  overflow-y: scroll;

  .close-x {
    width: 2rem;
    height: 2rem;
    fill: white;
  }
`

const routes = {
  dashborad: '/dashborad',
  claims: '/claims/list/1',
  questions: '/questions',
  search: '/members',
  tools: '/tools',
  trustly: 'https://backoffice.trustly.com/?Locale=en_GB#/tab_orders',
  adyen: 'https://ca-live.adyen.com',
  gsr: 'https://app.gsr.se/Account/SignIn',
  foss: 'https://foss.finansnorge.no/#/account/login',
}

const MenuItemsList = [
  {
    route: routes.dashborad,
    icon: House,
    title: 'Dashborad',
    single: true,
    external: false,
  },
  {
    route: routes.search,
    icon: Search,
    title: 'Search',
    single: true,
    external: false,
  },
  {
    route: routes.questions,
    icon: Inbox,
    title: 'Questions',
    single: false,
    external: false,
  },
  {
    route: routes.claims,
    icon: ShieldShaded,
    title: 'Claims',
    single: true,
    external: false,
  },
  {
    route: routes.tools,
    icon: Tools,
    title: 'Tools',
    single: true,
    external: false,
  },
  {
    route: routes.trustly,
    icon: CreditCard,
    title: 'Trustly',
    single: false,
    external: true,
  },
  {
    route: routes.adyen,
    icon: CreditCard2Front,
    title: 'Adyen',
    single: false,
    external: true,
  },
  {
    route: routes.gsr,
    icon: PersonBoundingBox,
    title: 'GSR',
    single: false,
    external: true,
  },
  {
    route: routes.foss,
    icon: PersonSquare,
    title: 'FOSS',
    single: true,
    external: true,
  },
]

const MenuItemContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-top: 2rem;
`

export const MobileTopBar = () => {
  const [showMenu, setShowMenu] = useState(false)
  const history = useHistory()

  return (
    <>
      {showMenu && (
        <Menu>
          <Flex fullWidth justify="flex-end" style={{ height: '5rem' }}>
            <X className="close-x" onClick={() => setShowMenu(false)} />
          </Flex>
          <MenuItemContainer>
            {MenuItemsList.map((item) =>
              !item.external ? (
                <MenuItem
                  onClick={() => setShowMenu(false)}
                  key={item.route}
                  style={{
                    marginBottom: item.single ? '4rem' : 0,
                    width: '100%',
                  }}
                  isActive={() => false}
                  to={
                    item.route !== routes.claims
                      ? item.route
                      : { pathname: routes.claims, state: { from: 'menu' } }
                  }
                  shouldAlwaysCollapse={false}
                  isCollapsed={false}
                  {...item}
                />
              ) : (
                <ExternalMenuItem
                  onClick={() => setShowMenu(false)}
                  key={item.route}
                  style={{
                    marginBottom: item.single ? '4rem' : 0,
                  }}
                  href={item.route}
                  shouldAlwaysCollapse={false}
                  isCollapsed={false}
                  {...item}
                />
              ),
            )}
            <CheckedInCard />
          </MenuItemContainer>
        </Menu>
      )}
      <Wrapper>
        <CircleButton onClick={() => history.push('/profile')}>
          <GearFill />
        </CircleButton>
        <div style={{ marginLeft: '1rem' }} />
        <CircleButton onClick={() => setShowMenu(true)}>
          <List />
        </CircleButton>
      </Wrapper>
    </>
  )
}
