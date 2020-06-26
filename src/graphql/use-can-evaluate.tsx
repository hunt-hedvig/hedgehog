import {
  CanEvaluate,
  CanEvaluateQueryHookResult,
  useCanEvaluateQuery,
} from 'api/generated/graphql'

type CanEvaluateReturnTuple = [
  CanEvaluate | undefined,
  CanEvaluateQueryHookResult,
]

export const useCanEvaluate = (
  typeOfContract: string,
  itemFamilyId: string,
  itemTypeId: string | null,
): CanEvaluateReturnTuple => {
  const queryResult = useCanEvaluateQuery({
    variables: {
      typeOfContract,
      itemFamilyId,
      itemTypeId,
    },
  })
  const canEvaluate = queryResult.data?.canEvaluate as CanEvaluate | undefined
  return [canEvaluate, queryResult]
}
