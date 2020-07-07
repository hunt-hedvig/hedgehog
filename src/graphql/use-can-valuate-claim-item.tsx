import {
  CanValuateClaimItem,
  CanValuateClaimItemQueryHookResult,
  TypeOfContract,
  useCanValuateClaimItemQuery,
} from 'api/generated/graphql'

type CanValuateClaimItemReturnTuple = [
  CanValuateClaimItem | undefined,
  CanValuateClaimItemQueryHookResult,
]

export const useCanValuateClaimItem = (
  itemFamilyId: string,
  itemTypeId: string | null,
  typeOfContract: TypeOfContract,
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
