import {
  Evaluation,
  GetEvaluationQueryHookResult,
  useGetEvaluationQuery,
} from 'api/generated/graphql'

type GetEvaluationReturnTuple = [
  Evaluation | undefined,
  GetEvaluationQueryHookResult,
]

export const useGetEvaluation = (
  purchasePrice: number,
  itemFamilyId: string,
  typeOfContract: string,
  purchaseDate: Date,
  itemTypeId: string | null,
  baseDate: Date | null,
): GetEvaluationReturnTuple => {
  const queryResult = useGetEvaluationQuery({
    variables: {
      purchasePrice,
      itemFamilyId,
      itemTypeId,
      typeOfContract,
      purchaseDate,
      baseDate,
    },
  })
  const evaluation = queryResult.data?.getEvaluation as Evaluation | undefined
  return [evaluation, queryResult]
}
