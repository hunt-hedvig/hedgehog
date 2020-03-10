import {
  ChangeTerminationDateMutation,
  ChangeTerminationDateMutationHookResult,
  ChangeTerminationDateMutationOptions,
  ChangeTerminationDateMutationVariables,
  Contract,
  useChangeTerminationDateMutation,
} from 'api/generated/graphql'
import { format } from 'date-fns'
import { withRefetchContracts } from './use-contracts'

export const useChangeTerminationDate = (
  contract: Contract,
): ChangeTerminationDateMutationHookResult => {
  return withRefetchContracts<
    ChangeTerminationDateMutation,
    ChangeTerminationDateMutationVariables
  >(useChangeTerminationDateMutation(), contract)
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
