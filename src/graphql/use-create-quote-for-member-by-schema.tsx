import { MutationFunctionOptions } from '@apollo/client'
import { JSONSchema7 } from 'json-schema'
import {
  CreateQuoteForMemberBySchemaMutation,
  CreateQuoteForMemberBySchemaMutationVariables,
  GetQuotesDocument,
  useCreateQuoteForMemberBySchemaMutation,
} from 'types/generated/graphql'

export const useCreateQuoteForMemberBySchema = () =>
  useCreateQuoteForMemberBySchemaMutation()

interface GetCreateQuoteForMemberBySchemaOptionsParams {
  memberId: string
  schema: JSONSchema7
  formData: Record<string, unknown>
  bypassUnderwritingGuidelines: boolean
}

export const getCreateQuoteForMemberBySchemaOptions = ({
  memberId,
  schema,
  formData,
  bypassUnderwritingGuidelines,
}: GetCreateQuoteForMemberBySchemaOptionsParams): MutationFunctionOptions<
  CreateQuoteForMemberBySchemaMutation,
  CreateQuoteForMemberBySchemaMutationVariables
> => {
  return {
    variables: {
      memberId,
      schemaData: {
        ...formData,
        id: schema.$id,
      },
      bypassUnderwritingGuidelines,
    },
    refetchQueries: () => [
      {
        query: GetQuotesDocument,
        variables: { memberId },
      },
    ],
  }
}
