import { useGetMemberInfoLazyQuery } from 'api/generated/graphql'
import React from 'react'
import styled from 'react-emotion'
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

const Breadcrumbs: React.FC<any> = ({ history }) => {
  const [getMember, { loading, data, error }] = useGetMemberInfoLazyQuery()

  const pathname = history.location.pathname
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

    if (i === arr.length - 1) {
      if (pathname.indexOf('members/') >= 0 && !loading && !data && !error) {
        const memberId = path
        getMember({ variables: { memberId } })
      }

      const content = data?.member
        ? `${data.member.firstName} ${data.member.lastName}`
        : path.toLowerCase()

      return {
        key: i,
        content,
        active: false,
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
