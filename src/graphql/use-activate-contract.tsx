import { format } from 'date-fns'
import {
  ActivatePendingAgreementMutationHookResult,
  ActivatePendingAgreementMutationOptions,
  Contract,
  useActivatePendingAgreementMutation,
} from '../api/generated/graphql'
import { refetchContracts } from './use-contracts'

export const useActivateContract = (
  contract: Contract,
): ActivatePendingAgreementMutationHookResult => {
  return useActivatePendingAgreementMutation({
    refetchQueries: () => [refetchContracts(contract.holderMemberId)],
  })
}

export const activateContractOptions = (
  contract: Contract,
  activeFrom: Date,
): ActivatePendingAgreementMutationOptions => {
  return {
    variables: {
      request: {
        contractId: contract.id,
        agreementId: contract.currentAgreementId,
        fromDate: format(activeFrom, 'yyyy-MM-dd'),
      },
    },
  }
}
