import {
  ChangeTerminationDateMutationHookResult,
  ChangeTerminationDateMutationOptions,
  Contract,
  useChangeTerminationDateMutation,
} from 'api/generated/graphql'
import { format } from 'date-fns'
import { refetchContracts } from './use-contracts'

export const useChangeTerminationDate = (
  contract: Contract,
): ChangeTerminationDateMutationHookResult => {
  return useChangeTerminationDateMutation({
    refetchQueries: () => [refetchContracts(contract.holderMemberId)],
  })
}

export const changeTerminationDateOptions = (
  contract: Contract,
  newTerminationDate: Date,
): ChangeTerminationDateMutationOptions => {
  return {
    variables: {
      request: {
        contractId: contract.id,
        newTerminationDate: format(newTerminationDate, 'yyyy-MM-dd'),
      },
    },
  }
}
