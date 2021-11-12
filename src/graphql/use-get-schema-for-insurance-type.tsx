import { JSONSchema7 } from 'json-schema'
import { InsuranceType } from 'types/enums'
import {
  GetSchemaForInsuranceTypeQueryHookResult,
  useGetSchemaForInsuranceTypeQuery,
} from 'types/generated/graphql'

type GetSchemaForInsuranceTypeReturnTuple = [
  JSONSchema7,
  GetSchemaForInsuranceTypeQueryHookResult,
]

export const useSchemaForInsuranceType = (
  insuranceType: InsuranceType,
): GetSchemaForInsuranceTypeReturnTuple => {
  const queryResult = useGetSchemaForInsuranceTypeQuery({
    variables: {
      insuranceType,
    },
  })
  const schema = queryResult.data?.quoteSchemaForInsuranceType as object
  return [schema, queryResult]
}
