import { MutationFunctionOptions } from '@apollo/react-common'
import {
  CreateQuoteForNewContractMutation,
  CreateQuoteForNewContractMutationHookResult,
  CreateQuoteForNewContractMutationVariables,
  GetQuotesDocument,
  QuoteInput,
  Scalars,
  useCreateQuoteForNewContractMutation,
} from 'api/generated/graphql'

export const createQuoteForNewContract = (): CreateQuoteForNewContractMutationHookResult =>
  useCreateQuoteForNewContractMutation()

export const getCreateQuoteForNewContractOptions = (
  memberId: string,
  quoteInput: QuoteInput,
  bypassUnderwritingGuidelines: Scalars['Boolean'],
): MutationFunctionOptions<
  CreateQuoteForNewContractMutation,
  CreateQuoteForNewContractMutationVariables
> => {
  return {
    variables: {
      memberId,
      quoteInput,
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
