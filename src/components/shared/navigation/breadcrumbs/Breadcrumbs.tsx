import React, { useEffect } from 'react'
import styled from 'react-emotion'
import { useHistory, useLocation } from 'react-router'
import { Link } from 'react-router-dom'
import { Breadcrumb } from 'semantic-ui-react'

const BreadcrumbsContainer = styled.div`
  display: flex;
  margin: 20px 0;
  text-transform: capitalize;
  padding-bottom: 6rem;

  &,
  a {
    color: ${({ theme }) => theme.mutedText};
  }
`

const Breadcrumbs: React.FC = () => {
  const history = useHistory()
  const location = useLocation()

  const [pathname, setPathname] = React.useState<string>(location.pathname)

  useEffect(() => {
    history.listen((loc) => {
      setPathname(loc.pathname)
    })
  }, [])

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
          {path.toLowerCase()}
        </Link>
      ),
      active: true,
    }
  })
  return (
    <BreadcrumbsContainer>
      <Breadcrumb sections={paths} />
    </BreadcrumbsContainer>
  )
}

export default Breadcrumbs
