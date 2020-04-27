import { MutationFunctionOptions } from '@apollo/react-common'
import {
  Agreement,
  Contract,
  CreateQuoteFromBackOfficeMutation,
  CreateQuoteFromBackOfficeMutationHookResult,
  CreateQuoteFromBackOfficeMutationVariables,
  useCreateQuoteFromBackOfficeMutation,
} from '../api/generated/graphql'
import { withDelayedRefetchContracts } from './use-contracts'
import { QUOTES_QUERY } from './use-quotes'

export const useCreateQuoteFromBackOffice = (
  contract: Contract,
): CreateQuoteFromBackOfficeMutationHookResult => {
  return withDelayedRefetchContracts<
    CreateQuoteFromBackOfficeMutation,
    CreateQuoteFromBackOfficeMutationVariables
  >(useCreateQuoteFromBackOfficeMutation(), contract)
}

export const createQuoteFromBackOfficeOptions = (
  agreement: Agreement,
  contract: Contract,
): MutationFunctionOptions<
  CreateQuoteFromBackOfficeMutation,
  CreateQuoteFromBackOfficeMutationVariables
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
