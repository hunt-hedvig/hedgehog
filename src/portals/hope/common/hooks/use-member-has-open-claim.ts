import gql from 'graphql-tag'
import { ClaimState, useMemberHasOpenClaimQuery } from 'types/generated/graphql'

gql`
  query MemberHasOpenClaim($memberId: ID!) {
    member(id: $memberId) {
      memberId
      claims {
        id
        state
      }
    }
  }
`

export const useMemberHasOpenClaim = (memberId: string) => {
  const { data } = useMemberHasOpenClaimQuery({
    variables: { memberId },
    fetchPolicy: 'cache-first',
  })

  const claims = data?.member?.claims ?? []
  const openClaims = claims.filter((claim) =>
    [ClaimState.Open, ClaimState.Reopened].includes(claim.state),
  )

  return openClaims.length === 1 ? openClaims[0] : null
}
