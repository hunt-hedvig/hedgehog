import { MutationFunctionOptions } from '@apollo/react-common'
import { format } from 'date-fns'
import {
  Agreement,
  ChangeFromDateMutation,
  ChangeFromDateMutationHookResult,
  ChangeFromDateMutationVariables,
  Contract,
  useChangeFromDateMutation,
} from '../api/generated/graphql'
import { withDelayedRefetchContracts } from './use-contracts'

export const useChangeFromDate = (
  contract: Contract,
): ChangeFromDateMutationHookResult => {
  return withDelayedRefetchContracts<
    ChangeFromDateMutation,
    ChangeFromDateMutationVariables
  >(useChangeFromDateMutation(), contract)
}

export const changeFromDateOptions = (
  agreement: Agreement,
  newFromDate: Date,
): MutationFunctionOptions<
  ChangeFromDateMutation,
  ChangeFromDateMutationVariables
> => {
  return {
    variables: {
      agreementId: agreement.id,
      request: {
        newFromDate: format(newFromDate, 'yyyy-MM-dd'),
      },
    },
  }
}
