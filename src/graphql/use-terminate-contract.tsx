import { MutationFunctionOptions } from '@apollo/react-common'
import { format } from 'date-fns'
import {
  Contract,
  TerminateContractMutation,
  TerminateContractMutationHookResult,
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
