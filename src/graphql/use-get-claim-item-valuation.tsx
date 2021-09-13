import {
  ClaimItemValuation,
  GetClaimItemValuationQueryHookResult,
  GetValuationInput,
  useGetClaimItemValuationQuery,
} from 'types/generated/graphql'

type GetClaimItemValuationReturnTuple = [
  ClaimItemValuation | undefined,
  GetClaimItemValuationQueryHookResult | undefined,
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
