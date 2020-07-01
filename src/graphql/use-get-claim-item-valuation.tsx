import {
  ClaimItemValuation,
  GetClaimItemValuationQueryHookResult,
  GetValuationInput,
  useGetClaimItemValuationQuery,
} from 'api/generated/graphql'

type GetClaimItemValuationReturnTuple = [
  ClaimItemValuation | undefined,
  GetClaimItemValuationQueryHookResult,
]

export const useGetClaimItemValuation = (
  request: GetValuationInput,
): GetClaimItemValuationReturnTuple => {
  const queryResult = useGetClaimItemValuationQuery({
    variables: {
      request,
    },
  })
  const valuation = queryResult.data?.getClaimItemValuation as
    | ClaimItemValuation
    | undefined
  return [valuation, queryResult]
}
