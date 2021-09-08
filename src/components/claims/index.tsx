import { Spacing } from '@hedvig-ui'
import { Claim } from 'api/generated/graphql'
import { ListPage } from 'components/shared'
import { Paginator } from 'components/shared/paginator/Paginator'
import { useListClaims } from 'graphql/use-list-claims'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import { LoadingMessage } from 'hedvig-ui/animations/standalone-message'
import React, { useEffect } from 'react'
import { RouteComponentProps, useHistory } from 'react-router'
import { Header } from 'semantic-ui-react'
import { useVerticalKeyboardNavigation } from 'utils/keyboard-actions'
import { ClaimListHeader } from './claims-list/components/ClaimListHeader'
import { ClaimListItem } from './claims-list/components/ClaimListItem'

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
