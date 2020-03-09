import { format } from 'date-fns'
import {
  Contract,
  TerminateContractMutationHookResult,
  TerminateContractMutationOptions,
  TerminationReason,
  useTerminateContractMutation,
} from '../api/generated/graphql'
import { refetchContracts } from './use-contracts'

export const useTerminateContract = (
  contract: Contract,
): TerminateContractMutationHookResult => {
  return useTerminateContractMutation({
    refetchQueries: () => [refetchContracts(contract.holderMemberId)],
  })
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
