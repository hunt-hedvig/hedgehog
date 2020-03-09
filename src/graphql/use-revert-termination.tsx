import { MutationFunctionOptions } from '@apollo/react-common'
import {
  Contract,
  RevertTerminationMutation,
  RevertTerminationMutationHookResult,
  RevertTerminationMutationVariables,
  useRevertTerminationMutation,
} from '../api/generated/graphql'
import { refetchContracts } from './use-contracts'

export const useRevertTermination = (
  contract: Contract,
): RevertTerminationMutationHookResult => {
  return useRevertTerminationMutation({
    refetchQueries: () => [refetchContracts(contract.holderMemberId)],
  })
}

export const revertTerminationOptions = (
  contract: Contract,
): MutationFunctionOptions<
  RevertTerminationMutation,
  RevertTerminationMutationVariables
> => {
  return {
    variables: {
      contractId: contract.id,
    },
  }
}
