import { format } from 'date-fns'
import {
  ActivatePendingAgreementMutation,
  ActivatePendingAgreementMutationHookResult,
  ActivatePendingAgreementMutationOptions,
  ActivatePendingAgreementMutationVariables,
  Contract,
  useActivatePendingAgreementMutation,
} from '../api/generated/graphql'
import { withRefetchContracts } from './use-contracts'

export const useActivateContract = (
  contract: Contract,
): ActivatePendingAgreementMutationHookResult => {
  return withRefetchContracts<
    ActivatePendingAgreementMutation,
    ActivatePendingAgreementMutationVariables
  >(useActivatePendingAgreementMutation(), contract)
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
