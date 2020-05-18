import {
  GetContractsDocument,
  SignQuoteForNewContractMutation,
  SignQuoteForNewContractMutationHookResult,
  SignQuoteForNewContractMutationVariables,
  useSignQuoteForNewContractMutation,
} from '../api/generated/graphql'
import { MutationFunctionOptions } from '@apollo/react-common'
import { QUOTES_QUERY } from './use-quotes'
import { format } from 'date-fns'

export const useSignQuoteForNewContract = (): SignQuoteForNewContractMutationHookResult =>
  useSignQuoteForNewContractMutation()

export const signQuoteForNewContractOptions = (
  quoteId: string,
  activationDate: Date,
  memberId: string,
): MutationFunctionOptions<
  SignQuoteForNewContractMutation,
  SignQuoteForNewContractMutationVariables
> => {
  return {
    variables: {
      quoteId: quoteId,
      activationDate: format(activationDate, 'yyyy-MM-dd'),
    },
    refetchQueries: () => [
      {
        query: QUOTES_QUERY,
        variables: { memberId: memberId },
      },
      {
        query: GetContractsDocument,
        variables: { memberId: memberId },
      },
    ],
  }
}
