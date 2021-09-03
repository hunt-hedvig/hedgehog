import styled from '@emotion/styled'
import { Claim } from 'api/generated/graphql'
import { ListPage } from 'components/shared'
import { Paginator } from 'components/shared/paginator/Paginator'
import { useListClaims } from 'graphql/use-list-claims'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import { LoadingMessage } from 'hedvig-ui/animations/standalone-message'
import { Spacing } from 'hedvig-ui/spacing'
import React, { useEffect } from 'react'
import { RouteComponentProps, useHistory } from 'react-router'
import { Header } from 'semantic-ui-react'
import { useVerticalKeyboardNavigation } from 'utils/keyboard-actions'
import { ClaimListHeader } from './claims-list/components/ClaimListHeader'
import { ClaimListItem } from './claims-list/components/ClaimListItem'

const Table = styled.table`
  margin-top: 2em;
  font-weight: normal;
  text-align: left;
  width: 100%;
  border-collapse: collapse;

  th {
    font-weight: lighter;
    color: ${({ theme }) => theme.semiStrongForeground};
    font-size: 0.8em;
    padding: 0.5em 1em 0.5em 1.2em;
    background-color: ${({ theme }) => theme.accentSecondary};
  }

  th:first-child {
    border-radius: 8px 0 0 8px;
  }

  th:last-child {
    border-radius: 0 8px 8px 0;
  }

  tr {
    width: 100%;
    background-color: transparent;
    transition: all 150ms;

    :hover {
      cursor: pointer;
      background-color: ${({ theme }) => theme.accentSecondary};
    }
  }

  td {
    padding: 1.6em 1em;
    font-size: 1.05em;
    transition: all 100ms;
    border-bottom: 1px solid ${({ theme }) => theme.accentSecondary};
  }

  td:first-child {
    :hover {
      border-radius: 8px 0 0 8px;
    }
  }

  td:last-child {
    :hover {
      border-radius: 0 8px 8px 0;
    }
  }
`

const Badge = styled.span`
  padding: 0.3em 1em;
  background-color: ${({ theme }) => theme.lightSuccess};
  color: ${({ theme }) => theme.success};
  font-weight: bold;
  font-size: 0.7em;
  border-radius: 8px;
`

const GroupTag = styled.span`
  font-size: 0.6em;
  background-color: ${({ theme }) => theme.lightSuccess};
  font-weight: bold;
  color: ${({ theme }) => theme.success};
  padding: 0.2em 0.6em;
  border-radius: 8px;
  margin-left: 0.7em;
  margin-right: -0.7em;
`

export const ClaimsList: React.FC<RouteComponentProps<{
  page?: string
}>> = ({ match }) => {
  const history = useHistory()
  const selectedPage = parseInt(match.params.page ?? '1', 10)
  const [
    { claims, page: currentPage, totalPages },
    listClaims,
    { loading },
  ] = useListClaims()

  const [currentKeyboardNavigationStep] = useVerticalKeyboardNavigation({
    maxStep: claims.length - 1,
    onPerformNavigation: (index) => {
      const claimId = claims[index].id
      const memberId = claims[index].member?.memberId

      if (!claimId || !memberId) {
        return
      }

      history.push(`/claims/${claimId}/members/${memberId}`)
    },
  })

  useEffect(() => {
    listClaims({ page: selectedPage - 1 ?? 0 })
  }, [selectedPage])

  return (
    <ListPage>
      <FadeIn>
        <Header size="huge">Claims</Header>
      </FadeIn>
      {loading && !claims ? <LoadingMessage paddingTop={'25vh'} /> : <></>}

      <Table>
        <tr>
          <th>Member</th>
          <th>Date Registered</th>
          <th>Claim Type</th>
          <th>Claim State</th>
          <th>Claim Reserves</th>
        </tr>
        <tr>
          <td>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span>Rasmus Guterstam</span>
              <div>
                <span style={{ fontSize: '0.8em', color: '#848484' }}>
                  123456789
                </span>
                <GroupTag>First Group</GroupTag>
              </div>
            </div>
          </td>
          <td>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>August 31, 2021</span>
              <span style={{ fontSize: '0.8em', color: '#848484' }}>11:42</span>
            </div>
          </td>

          <td>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>Theft Claim</span>
            </div>
          </td>

          <td>
            <Badge>OPEN</Badge>
          </td>

          <td>
            <span
              style={{
                borderBottom: '1px solid #222222',
              }}
            >
              450 <span style={{ fontSize: '0.6em' }}>SEK</span>
            </span>
          </td>
        </tr>
        <tr>
          <td>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>Rasmus Guterstam</span>
              <div>
                <span style={{ fontSize: '0.8em', color: '#848484' }}>
                  123456789
                </span>
                <GroupTag>Second Group</GroupTag>
              </div>
            </div>
          </td>
          <td>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>August 31, 2021</span>
              <span style={{ fontSize: '0.8em', color: '#848484' }}>11:42</span>
            </div>
          </td>

          <td>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span>Theft Claim</span>
            </div>
          </td>

          <td>
            <Badge>OPEN</Badge>
          </td>

          <td>
            <span style={{ color: '#aaaaaa' }}>Not specified</span>
          </td>
        </tr>
      </Table>
    </ListPage>
  )

  return (
    <ListPage>
      <FadeIn>
        <Header size="huge">Claims List</Header>
      </FadeIn>
      {loading && !claims ? (
        <LoadingMessage paddingTop={'25vh'} />
      ) : (
        <Spacing top={'small'}>
          <FadeIn delay={'200ms'}>
            <Paginator<Claim>
              currentPage={currentPage}
              totalPages={totalPages}
              onChangePage={(nextPage) =>
                history.push(`/claims/list/${nextPage + 1}`)
              }
              pagedItems={claims}
              itemContent={(claim, index) => (
                <ClaimListItem
                  index={index}
                  item={claim}
                  active={currentKeyboardNavigationStep === index}
                />
              )}
              tableHeader={
                <ClaimListHeader
                  onSort={(column, direction) => {
                    listClaims({
                      includeAll: true,
                      page: currentPage,
                      pageSize: 20,
                      sortBy: column,
                      sortDirection: direction,
                    })
                  }}
                />
              }
            />
          </FadeIn>
        </Spacing>
      )}
    </ListPage>
  )
}
