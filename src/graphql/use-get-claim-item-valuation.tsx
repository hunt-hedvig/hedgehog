import {
  ClaimItemValuation,
  GetClaimItemValuationQueryHookResult,
  GetValuationInput,
  Maybe,
  Scalars,
  TypeOfContract,
  useGetClaimItemValuationQuery,
} from 'api/generated/graphql'

type GetClaimItemValuationReturnTuple = [
  ClaimItemValuation | undefined,
  GetClaimItemValuationQueryHookResult | undefined,
]

interface GetClaimItemValuationInput {
  purchasePrice?: Scalars['MonetaryAmount'] | null
  itemFamilyId?: Scalars['String'] | null
  itemTypeId?: Maybe<Scalars['ID']>
  typeOfContract: TypeOfContract
  purchaseDate: Scalars['LocalDate']
  baseDate?: Maybe<Scalars['LocalDate']>
}

export const useGetClaimItemValuation = (
  request: GetClaimItemValuationInput,
): GetClaimItemValuationReturnTuple => {
  if (!request.purchasePrice || !request.itemFamilyId) {
    return [undefined, undefined]
  }
  const queryResult = useGetClaimItemValuationQuery({
    variables: {
      request: request as GetValuationInput,
    },
  })
  const valuation = queryResult.data?.getClaimItemValuation as
    | ClaimItemValuation
    | undefined
  return [valuation, queryResult]
}
