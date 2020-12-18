import { Claim } from 'api/generated/graphql'
import { ListHeader } from 'components/claims/claims-list/components/ListHeader'
import { ListItem } from 'components/claims/claims-list/components/ListItem'
import { ListWrapper } from 'components/members-search/styles'
import BackendPaginatorList from 'components/shared/paginator-list/BackendPaginatorList'
import { useListClaims } from 'graphql/use-list-claims'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import { LoadingMessage } from 'hedvig-ui/animations/standalone-message'
import { Spacing } from 'hedvig-ui/spacing'
import React from 'react'
import { Header } from 'semantic-ui-react'
import { history } from 'store'
import { useVerticalKeyboardNavigation } from 'utils/keyboard-actions'

const linkClickHandler = (id: string, memberId: string) => {
  history.push(`/claims/${id}/members/${memberId}`)
}

export const Claims: React.FC = () => {
  const [
    { claims, page, totalPages },
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

      linkClickHandler(claimId, memberId)
    },
  })

  React.useEffect(() => {
    listClaims()
  }, [])

  if (loading) {
    return <LoadingMessage paddingTop={'25vh'} />
  }

  return (
    <>
      <FadeIn>
        <Header size="huge">Claims List</Header>
      </FadeIn>
      <Spacing top={'small'}>
        <FadeIn delay={'200ms'}>
          <ListWrapper>
            <FadeIn>
              <BackendPaginatorList<Claim>
                currentPage={page}
                totalPages={totalPages}
                changePage={(nextPage) =>
                  listClaims({
                    includeAll: true,
                    page: nextPage,
                    pageSize: 25,
                  })
                }
                pagedItems={claims}
                itemContent={(claim, index) => (
                  <ListItem
                    index={index}
                    item={claim}
                    active={currentKeyboardNavigationStep === index}
                  />
                )}
                isSortable={false}
                tableHeader={<ListHeader />}
              />
            </FadeIn>
          </ListWrapper>
        </FadeIn>
      </Spacing>
    </>
  )
}
