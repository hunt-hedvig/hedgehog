import { InsuranceType } from 'portals/hope/features/config/constants'
import { JSONSchema7 } from 'json-schema'
import {
  QuoteSchemaForInsuranceTypeQueryHookResult,
  useQuoteSchemaForInsuranceTypeQuery,
} from 'types/generated/graphql'
import gql from 'graphql-tag'

type GetSchemaForInsuranceTypeReturnTuple = [
  JSONSchema7,
  QuoteSchemaForInsuranceTypeQueryHookResult,
]

gql`
  query QuoteSchemaForInsuranceType($insuranceType: String!) {
    quoteSchemaForInsuranceType(insuranceType: $insuranceType)
  }
`

export const useSchemaForInsuranceType = (
  insuranceType: InsuranceType,
): GetSchemaForInsuranceTypeReturnTuple => {
  const queryResult = useQuoteSchemaForInsuranceTypeQuery({
    variables: {
      insuranceType,
    },
  })
  const schema = queryResult.data?.quoteSchemaForInsuranceType as object
  return [schema, queryResult]
}
