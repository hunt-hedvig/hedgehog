import { format } from 'date-fns'
import {
  Contract,
  TerminateContractMutation,
  TerminateContractMutationHookResult,
  TerminateContractMutationOptions,
  TerminateContractMutationVariables,
  TerminationReason,
  useTerminateContractMutation,
} from '../api/generated/graphql'
import { withRefetchContracts } from './use-contracts'

export const useTerminateContract = (
  contract: Contract,
): TerminateContractMutationHookResult => {
  return withRefetchContracts<
    TerminateContractMutation,
    TerminateContractMutationVariables
  >(useTerminateContractMutation(), contract)
}

export const terminateContractOptions = (
  contract: Contract,
  terminationDate: Date,
  terminationReason: TerminationReason,
  comment?: string,
): TerminateContractMutationOptions => {
  return {
    variables: {
      request: {
        contractId: contract.id,
        terminationDate: format(terminationDate, 'yyyy-MM-dd'),
        terminationReason,
        comment,
      },
    },
  }
}
