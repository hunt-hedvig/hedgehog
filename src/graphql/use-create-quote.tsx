import { MutationFunctionOptions } from '@apollo/react-common'
import {
  Agreement,
  Contract,
  CreateQuoteFromAgreementMutation,
  CreateQuoteFromAgreementMutationHookResult,
  CreateQuoteFromAgreementMutationVariables,
  GetContractsDocument,
  useCreateQuoteFromAgreementMutation,
} from 'api/generated/graphql'
import { QUOTES_QUERY } from './use-quotes'

export const useCreateQuoteFromAgreement = (): CreateQuoteFromAgreementMutationHookResult =>
  useCreateQuoteFromAgreementMutation()

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
      {
        query: GetContractsDocument,
        variables: { memberId: contract.holderMemberId },
      },
    ],
  }
}
