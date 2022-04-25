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

export const useMemberHasOpenClaim = (memberId?: string | null) => {
  const { data } = useMemberHasOpenClaimQuery({
    variables: { memberId: memberId ?? '' },
    fetchPolicy: 'cache-first',
    skip: !memberId,
  })

  const claims = data?.member?.claims ?? []
  const openClaims = claims.filter((claim) =>
    [ClaimState.Open, ClaimState.Reopened].includes(claim.state),
  )

  return openClaims.length === 1 ? openClaims[0] : null
}
