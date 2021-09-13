import { JSONSchema7 } from 'json-schema'
import { ContractType } from 'types/enums'
import {
  GetSchemaForContractTypeQueryHookResult,
  useGetSchemaForContractTypeQuery,
} from 'types/generated/graphql'

type GetSchemaForContractTypeReturnTuple = [
  JSONSchema7,
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
