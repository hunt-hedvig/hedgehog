import { MutationFunctionOptions } from '@apollo/client'
import {
  Contract,
  TerminateContractMutation,
  TerminateContractMutationHookResult,
  TerminateContractMutationVariables,
  useTerminateContractMutation,
} from 'api/generated/graphql'
import { format } from 'date-fns'
import { TerminationReason } from 'types/enums'
import { withDelayedRefetchContracts } from './use-contracts'

export const useTerminateContract = (
  contract: Contract,
): TerminateContractMutationHookResult => {
  return withDelayedRefetchContracts<
    TerminateContractMutation,
    TerminateContractMutationVariables
  >(useTerminateContractMutation(), contract)
}

export const terminateContractOptions = (
  contract: Contract,
  terminationDate: Date,
  terminationReason: TerminationReason,
  comment?: string,
): MutationFunctionOptions<
  TerminateContractMutation,
  TerminateContractMutationVariables
> => {
  return {
    variables: {
      contractId: contract.id,
      request: {
        terminationDate: format(terminationDate, 'yyyy-MM-dd'),
        terminationReason,
        comment,
      },
    },
  }
}
