import { MutationFunctionOptions } from '@apollo/react-common'
import {
  Contract,
  CreateQuoteForNewContractMutation,
  CreateQuoteForNewContractMutationHookResult,
  CreateQuoteForNewContractMutationVariables,
  GetContractsDocument,
  QuoteInput,
  Scalars,
  useCreateQuoteForNewContractMutation,
} from '../api/generated/graphql'
import { QUOTES_QUERY } from './use-quotes'

export const createQuoteForNewContract = (): CreateQuoteForNewContractMutationHookResult =>
  useCreateQuoteForNewContractMutation()

export const createQuoteForNewContractOptions = (
  contract: Contract,
  quoteInput: QuoteInput,
  bypassUnderwritingGuidelines: Scalars['Boolean'],
): MutationFunctionOptions<
  CreateQuoteForNewContractMutation,
  CreateQuoteForNewContractMutationVariables
> => {
  return {
    variables: {
      memberId: contract.holderMemberId,
      quoteInput,
      bypassUnderwritingGuidelines,
    },
    refetchQueries: () => [
      {
        query: QUOTES_QUERY,
        variables: { memberId: contract.holderMemberId },
      },
      {
        query: GetContractsDocument,
        variables: { memberId: contract.holderMemberId },
      },
    ],
  }
}
