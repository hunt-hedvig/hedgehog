import { MutationFunctionOptions } from '@apollo/client'
import { format } from 'date-fns'
import {
  ChangeFromDateMutation,
  ChangeFromDateMutationHookResult,
  ChangeFromDateMutationVariables,
  Contract,
  GenericAgreement,
  useChangeFromDateMutation,
} from 'types/generated/graphql'
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
  agreement: GenericAgreement,
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
