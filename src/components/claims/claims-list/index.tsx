import { Claim, Member } from 'api/generated/graphql'
import React from 'react'
import { history } from 'store'
import { useVerticalKeyboardNavigation } from 'utils/keyboard-actions'
import { FadeIn, withFadeIn } from 'hedvig-ui/animations/fade-in'
import { TableRowProps } from 'semantic-ui-react'
import { LinkRow } from 'components/shared'
import BackendPaginatorList from 'components/shared/paginator-list/BackendPaginatorList'
import { ListItem } from 'components/members-search/components/ListItem'
import { ListHeader } from 'components/members-search/components/ListHeader'
import { ListWrapper } from 'components/members-search/styles'

export const ClaimsList: React.FC<{ claims: Claim[] }> = ({ claims }) => {
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
  return (
    <ListWrapper>
      <FadeIn>
        <BackendPaginatorList<Member>
          currentPage={page}
          totalPages={totalPages}
          changePage={(nextPage) =>
            memberSearch(query, {
              includeAll,
              page: nextPage,
              pageSize: 25,
            })
          }
          pagedItems={members}
          itemContent={(member, index) => (
            <ListItem
              index={index}
              member={member}
              active={currentKeyboardNavigationStep === index}
            />
          )}
          isSortable={false}
          tableHeader={<ListHeader />}
        />
      </FadeIn>
    </ListWrapper>
  )
}
