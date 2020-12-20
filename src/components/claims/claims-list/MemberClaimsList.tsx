import { ClaimListHeader } from 'components/claims/claims-list/components/ClaimListHeader'
import { ClaimListItem } from 'components/claims/claims-list/components/ClaimListItem'
import { useGetMemberClaims } from 'graphql/use-get-member-claims'
import {
  LoadingMessage,
  StandaloneMessage,
} from 'hedvig-ui/animations/standalone-message'
import React from 'react'
import { Table } from 'semantic-ui-react'

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
    <Table celled selectable>
      <ClaimListHeader />

      <Table.Body>
        {claims.map((item, index) => (
          <ClaimListItem key={item.id} item={item} index={index} />
        ))}
      </Table.Body>
    </Table>
  )
}
