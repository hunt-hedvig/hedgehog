import { MutationFunctionOptions } from '@apollo/react-common'
import {
  GetQuotesDocument,
  UpdateQuoteBySchemaMutation,
  UpdateQuoteBySchemaMutationVariables,
  useUpdateQuoteBySchemaMutation,
} from 'api/generated/graphql'

export const useUpdateQuoteBySchema = () => useUpdateQuoteBySchemaMutation()

export const getUpdateQuoteSchemaOptions = (
  memberId: string,
  quoteId: string,
  schema: object,
  formData: object,
  bypassUnderwritingGuidelines: boolean,
): MutationFunctionOptions<
  UpdateQuoteBySchemaMutation,
  UpdateQuoteBySchemaMutationVariables
> => {
  return {
    variables: {
      quoteId,
      schemaData: {
        ...formData,
        // @ts-ignore
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
