import { MutationFunctionOptions } from '@apollo/react-common'
import {
  CreateQuoteForNewContractMutation,
  CreateQuoteForNewContractMutationHookResult,
  CreateQuoteForNewContractMutationVariables,
  QuoteInput,
  Scalars,
  useCreateQuoteForNewContractMutation,
} from 'api/generated/graphql'
import { QUOTES_QUERY } from './use-quotes'

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
        query: QUOTES_QUERY,
        variables: { memberId },
      },
    ],
  }
}
