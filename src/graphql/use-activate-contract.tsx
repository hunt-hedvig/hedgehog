import { MutationFunctionOptions } from '@apollo/client'
import { format } from 'date-fns'
import {
  ActivatePendingAgreementMutation,
  ActivatePendingAgreementMutationHookResult,
  ActivatePendingAgreementMutationVariables,
  Contract,
  useActivatePendingAgreementMutation,
} from 'types/generated/graphql'
import { withDelayedRefetchContracts } from './use-contracts'

export const useActivateContract = (
  contract: Contract,
): ActivatePendingAgreementMutationHookResult => {
  return withDelayedRefetchContracts<
    ActivatePendingAgreementMutation,
    ActivatePendingAgreementMutationVariables
  >(useActivatePendingAgreementMutation(), contract)
}

export const activateContractOptions = (
  contract: Contract,
  activeFrom: Date,
): MutationFunctionOptions<
  ActivatePendingAgreementMutation,
  ActivatePendingAgreementMutationVariables
> => {
  return {
    variables: {
      contractId: contract.id,
      request: {
        pendingAgreementId: contract.currentAgreementId,
        fromDate: format(activeFrom, 'yyyy-MM-dd'),
      },
    },
  }
}
