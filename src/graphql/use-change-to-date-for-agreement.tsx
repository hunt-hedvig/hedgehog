import { MutationFunctionOptions } from '@apollo/react-common'
import { format } from 'date-fns'
import {
  Agreement,
  ChangeToDateMutation,
  ChangeToDateMutationHookResult,
  ChangeToDateMutationVariables,
  Contract,
  useChangeToDateMutation,
} from '../api/generated/graphql'
import { withRefetchContracts } from './use-contracts'

export const useChangeToDate = (
  contract: Contract,
): ChangeToDateMutationHookResult => {
  return withRefetchContracts<
    ChangeToDateMutation,
    ChangeToDateMutationVariables
  >(useChangeToDateMutation(), contract)
}

export const changeToDateOptions = (
  agreement: Agreement,
  newToDate: Date,
): MutationFunctionOptions<
  ChangeToDateMutation,
  ChangeToDateMutationVariables
> => {
  return {
    variables: {
      agreementId: agreement.id,
      request: {
        newToDate: format(newToDate, 'yyyy-MM-dd'),
      },
    },
  }
}
