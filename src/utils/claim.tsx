import { Claim, ClaimState } from 'api/generated/graphql'

export const hasOpenClaim = (claims: ReadonlyArray<Claim>): boolean => {
  return claims.some(
    (claim) =>
      claim.state === ClaimState.Open || claim.state === ClaimState.Reopened,
  )
}
