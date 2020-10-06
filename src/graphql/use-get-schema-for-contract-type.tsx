import {
  ContractType,
  GetSchemaForContractTypeQueryHookResult,
  useGetSchemaForContractTypeQuery,
} from 'api/generated/graphql'

type GetSchemaForContractTypeReturnTuple = [
  object,
  GetSchemaForContractTypeQueryHookResult,
]

export const useSchemaForContractType = (
  contractType: ContractType,
): GetSchemaForContractTypeReturnTuple => {
  const queryResult = useGetSchemaForContractTypeQuery({
    variables: {
      contractType,
    },
  })
  const schema = queryResult.data?.quoteSchemaForContractType as object
  return [schema, queryResult]
}
