import { MutationFunctionOptions } from '@apollo/react-common'
import {
  AddAgreementFromQuoteMutation,
  AddAgreementFromQuoteMutationHookResult,
  AddAgreementFromQuoteMutationVariables,
  Contract,
  Quote,
  useAddAgreementFromQuoteMutation,
} from 'api/generated/graphql'
import { format } from 'date-fns'
import { withDelayedRefetchContracts } from './use-contracts'
import { QUOTES_QUERY } from './use-quotes'

// export const useAddAgreementFromQuote = (): AddAgreementFromQuoteMutationHookResult =>
//   useAddAgreementFromQuoteMutation()

export const useAddAgreementFromQuote = (
  contract: Contract,
): AddAgreementFromQuoteMutationHookResult => {
  return withDelayedRefetchContracts<
    AddAgreementFromQuoteMutation,
    AddAgreementFromQuoteMutationVariables
  >(useAddAgreementFromQuoteMutation(), contract)
}

export const addAgreementFromQuoteOptions = (
  contract: Contract,
  activeFrom: Date,
  activeTo: Date | null,
  previousAgreementActiveTo: Date | null,
  quote: Quote,
): MutationFunctionOptions<
  AddAgreementFromQuoteMutation,
  AddAgreementFromQuoteMutationVariables
> => {
  return {
    variables: {
      id: quote.id,
      activeFrom: format(activeFrom, 'yyyy-MM-dd'),
      activeTo: activeTo ? format(activeTo, 'yyy-MM-dd') : null,
      contractId: contract.id,
      previousAgreementActiveTo: previousAgreementActiveTo
        ? format(previousAgreementActiveTo, 'yyy-MM-dd')
        : null,
    },
    refetchQueries: () => [
      {
        query: QUOTES_QUERY,
        variables: { memberId: contract.holderMemberId },
      },
    ],
  }
}
