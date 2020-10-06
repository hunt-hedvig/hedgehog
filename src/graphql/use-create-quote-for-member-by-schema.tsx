import { MutationFunctionOptions } from '@apollo/react-common'
import {
  CreateQuoteForMemberBySchemaMutation,
  CreateQuoteForMemberBySchemaMutationVariables,
  GetQuotesDocument,
  useCreateQuoteForMemberBySchemaMutation,
} from 'api/generated/graphql'

export const useCreateQuoteForMemberBySchema = () =>
  useCreateQuoteForMemberBySchemaMutation()

export const getCreateQuoteForMemberBySchemaOptions = (
  memberId: string,
  schema: object,
  formData: object,
  bypassUnderwritingGuidelines: boolean,
): MutationFunctionOptions<
  CreateQuoteForMemberBySchemaMutation,
  CreateQuoteForMemberBySchemaMutationVariables
> => {
  return {
    variables: {
      memberId,
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
