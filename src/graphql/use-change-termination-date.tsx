import { MutationFunctionOptions } from '@apollo/client'
import { format } from 'date-fns'
import {
  ChangeTerminationDateMutation,
  ChangeTerminationDateMutationHookResult,
  ChangeTerminationDateMutationVariables,
  Contract,
  useChangeTerminationDateMutation,
} from 'types/generated/graphql'
import { withDelayedRefetchContracts } from './use-contracts'

export const useChangeTerminationDate = (
  contract: Contract,
): ChangeTerminationDateMutationHookResult => {
  return withDelayedRefetchContracts<
    ChangeTerminationDateMutation,
    ChangeTerminationDateMutationVariables
  >(useChangeTerminationDateMutation(), contract)
}

export const changeTerminationDateOptions = (
  contract: Contract,
  newTerminationDate: Date,
): MutationFunctionOptions<
  ChangeTerminationDateMutation,
  ChangeTerminationDateMutationVariables
> => {
  return {
    variables: {
      contractId: contract.id,
      request: {
        newTerminationDate: format(newTerminationDate, 'yyyy-MM-dd'),
      },
    },
  }
}
