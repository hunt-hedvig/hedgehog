import {
  ClaimItemValuation,
  GetClaimItemValuationQueryHookResult,
  useGetClaimItemValuationQuery,
} from 'api/generated/graphql'

type GetClaimItemValuationReturnTuple = [
  ClaimItemValuation | undefined,
  GetClaimItemValuationQueryHookResult,
]

export const useGetClaimItemValuation = (
  purchasePrice: number,
  itemFamilyId: string,
  typeOfContract: string,
  purchaseDate: Date,
  itemTypeId: string | null,
  baseDate: Date | null,
): GetClaimItemValuationReturnTuple => {
  const queryResult = useGetClaimItemValuationQuery({
    variables: {
      purchasePrice,
      itemFamilyId,
      itemTypeId,
      typeOfContract,
      purchaseDate,
      baseDate,
    },
  })
  const valuation = queryResult.data?.getClaimItemValuation as
    | ClaimItemValuation
    | undefined
  return [valuation, queryResult]
}
