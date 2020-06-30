import {
  Claim,
  GetClaimsQueryResult,
  useGetClaimsQuery,
} from 'api/generated/graphql'

type ClaimsReturnTuple = [Claim, GetClaimsQueryResult]

export const useClaims = (id: string): ClaimsReturnTuple => {
  const queryResult = useGetClaimsQuery({
    variables: { id },
  })
  const claim = queryResult.data?.claim as Claim
  return [claim, queryResult]
}
