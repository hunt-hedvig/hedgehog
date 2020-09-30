import {
  GetSchemaForContractTypeQueryHookResult,
  useGetSchemaForContractTypeQuery,
} from 'api/generated/graphql'

type GetSchemaForContractTypeReturnTuple = [
  object,
  GetSchemaForContractTypeQueryHookResult,
]

export const useSchemaForContractType = (
  contractType,
): GetSchemaForContractTypeReturnTuple => {
  const queryResult = useGetSchemaForContractTypeQuery({
    variables: {
      contractType,
    },
  })
  const schema = queryResult.data?.quoteSchemaForContractType as object
  return [schema, queryResult]
}
