import styled from '@emotion/styled'
import { Breadcrumb } from '@hedvig-ui'
import React from 'react'
import { useLocation } from 'react-router'
import { Link } from 'react-router-dom'

const NavigationContainer = styled.div`
  display: flex;
  margin: 20px 0;
  text-transform: capitalize;
  padding-bottom: 3rem;

  &,
  a {
    color: ${({ theme }) => theme.mutedText};
  }
`

export const BreadcrumbsNavigation: React.FC = () => {
  const { pathname } = useLocation()

  if (pathname.startsWith('/login')) {
    return null
  }

  const paths = pathname.split('/').map((path, i, arr) => {
    if (i === 0) {
      return {
        key: i,
        content: <span>Dashborad</span>,
        active: true,
      }
    }

    return {
      key: i,
      content: (
        <Link to={`${arr.slice(0, i + 1).join('/')}`}>
          {path.toLowerCase().replace('-', ' ')}
        </Link>
      ),
      active: true,
    }
  })
  return (
    <NavigationContainer>
      <Breadcrumb sections={paths} />
    </NavigationContainer>
  )
}
