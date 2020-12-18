import { ListHeader } from 'components/claims/claims-list/components/ListHeader'
import { ListItem } from 'components/claims/claims-list/components/ListItem'
import PaginatorList from 'components/shared/paginator-list/PaginatorList'
import { useGetMemberClaims } from 'graphql/use-get-member-claims'
import {
  LoadingMessage,
  StandaloneMessage,
} from 'hedvig-ui/animations/standalone-message'
import React from 'react'

// TODO: Implement actual sorting

export const MemberClaimsList: React.FC<{ memberId: string }> = ({
  memberId,
}) => {
  const [claims, { loading }] = useGetMemberClaims(memberId)

  if (loading || !claims) {
    return <LoadingMessage paddingTop="25vh" />
  }

  if (claims.length === 0) {
    return (
      <StandaloneMessage paddingTop="10vh">
        Claims list is empty
      </StandaloneMessage>
    )
  }

  return (
    <PaginatorList
      list={claims}
      itemContent={(claim, index) => (
        <ListItem key={claim.id} index={index} item={claim} active={false} />
      )}
      tableHeader={<ListHeader />}
      pageSize={20}
      isSortable={true}
      keyName="id"
    />
  )
}
