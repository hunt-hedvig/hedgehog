import { MutationFunctionOptions } from '@apollo/react-common'
import {
  GetContractsDocument,
  SignQuoteForNewContractMutation,
  SignQuoteForNewContractMutationHookResult,
  SignQuoteForNewContractMutationVariables,
  useSignQuoteForNewContractMutation,
} from 'api/generated/graphql'
import { format } from 'date-fns'
import { QUOTES_QUERY } from './use-quotes'

export const useSignQuoteForNewContract = (): SignQuoteForNewContractMutationHookResult =>
  useSignQuoteForNewContractMutation()

export const getSignQuoteForNewContractOptions = (
  quoteId: string,
  activationDate: Date,
  memberId: string,
): MutationFunctionOptions<
  SignQuoteForNewContractMutation,
  SignQuoteForNewContractMutationVariables
> => {
  return {
    variables: {
      quoteId,
      activationDate: format(activationDate, 'yyyy-MM-dd'),
    },
    refetchQueries: () => [
      {
        query: QUOTES_QUERY,
        variables: { memberId },
      },
      {
        query: GetContractsDocument,
        variables: { memberId },
      },
    ],
  }
}
