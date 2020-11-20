import {
  CanValuateClaimItem,
  CanValuateClaimItemQueryHookResult,
  useCanValuateClaimItemQuery,
} from 'api/generated/graphql'

type CanValuateClaimItemReturnTuple = [
  CanValuateClaimItem | undefined,
  CanValuateClaimItemQueryHookResult,
]

export const useCanValuateClaimItem = (
  itemFamilyId: string,
  itemTypeId: string | null,
  typeOfContract: String,
): CanValuateClaimItemReturnTuple => {
  const queryResult = useCanValuateClaimItemQuery({
    variables: {
      typeOfContract,
      itemFamilyId,
      itemTypeId,
    },
  })
  const canValuateClaimItem = queryResult.data?.canValuateClaimItem as
    | CanValuateClaimItem
    | undefined
  return [canValuateClaimItem, queryResult]
}
