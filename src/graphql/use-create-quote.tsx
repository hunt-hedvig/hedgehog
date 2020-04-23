import { MutationFunctionOptions } from '@apollo/react-common'
import {
  Agreement,
  Contract,
  CreateQuoteFromBackOfficeMutation,
  CreateQuoteFromBackOfficeMutationHookResult,
  CreateQuoteFromBackOfficeMutationVariables,
  useCreateQuoteFromBackOfficeMutation,
} from '../api/generated/graphql'
import { withRefetchContracts } from './use-contracts'

export const useCreateQuoteFromBackOffice = (
  contract: Contract,
): CreateQuoteFromBackOfficeMutationHookResult => {
  return withRefetchContracts<
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
  }
}
