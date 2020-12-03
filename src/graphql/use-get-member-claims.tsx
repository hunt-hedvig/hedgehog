import {
  Claim,
  GetMemberClaimsQueryResult,
  useGetMemberClaimsQuery,
} from 'api/generated/graphql'

type UseGetMemberClaimsReturnTuple = [
  Claim[] | undefined,
  GetMemberClaimsQueryResult,
]

export const useGetMemberClaims = (
  memberId: string,
): UseGetMemberClaimsReturnTuple => {
  const queryResult = useGetMemberClaimsQuery({
    variables: {
      memberId,
    },
  })
  const claims = queryResult?.data?.member?.claims as Claim[] | undefined
  return [claims, queryResult]
}
