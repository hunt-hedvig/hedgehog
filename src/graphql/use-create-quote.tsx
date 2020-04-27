import { MutationFunctionOptions } from '@apollo/react-common'
import {
  Agreement,
  Contract,
  CreateQuoteFromAgreementMutation,
  CreateQuoteFromAgreementMutationHookResult,
  CreateQuoteFromAgreementMutationVariables,
  useCreateQuoteFromAgreementMutation,
} from '../api/generated/graphql'
import { withDelayedRefetchContracts } from './use-contracts'
import { QUOTES_QUERY } from './use-quotes'

export const useCreateQuoteFromAgreement = (
  contract: Contract,
): CreateQuoteFromAgreementMutationHookResult => {
  return withDelayedRefetchContracts<
    CreateQuoteFromAgreementMutation,
    CreateQuoteFromAgreementMutationVariables
  >(useCreateQuoteFromAgreementMutation(), contract)
}

export const createQuoteFromAgreementOptions = (
  agreement: Agreement,
  contract: Contract,
): MutationFunctionOptions<
  CreateQuoteFromAgreementMutation,
  CreateQuoteFromAgreementMutationVariables
> => {
  return {
    variables: {
      agreementId: agreement.id,
      memberId: contract.holderMemberId,
    },
    refetchQueries: () => [
      {
        query: QUOTES_QUERY,
        variables: { memberId: contract.holderMemberId },
      },
    ],
  }
}
