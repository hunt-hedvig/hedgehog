import { MutationFunctionOptions } from '@apollo/react-common'
import {
  ChangeTerminationDateMutation,
  ChangeTerminationDateMutationHookResult,
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
