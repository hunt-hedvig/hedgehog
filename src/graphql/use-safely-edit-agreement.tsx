import { MutationFunctionOptions } from '@apollo/react-common'
import {
  Contract,
  SafelyEditAgreementMutation,
  SafelyEditAgreementMutationHookResult,
  SafelyEditAgreementMutationVariables,
  useSafelyEditAgreementMutation,
} from 'api/generated/graphql'
import { withDelayedRefetchContracts } from './use-contracts'

export const useSafelyEditAgreement = (
  contract: Contract,
): SafelyEditAgreementMutationHookResult => {
  return withDelayedRefetchContracts<
    SafelyEditAgreementMutation,
    SafelyEditAgreementMutationVariables
  >(useSafelyEditAgreementMutation(), contract)
}

export const safelyEditAgreementOptions = (
  agreementId: string,
  newStreet: string,
): MutationFunctionOptions<
  SafelyEditAgreementMutation,
  SafelyEditAgreementMutationVariables
> => {
  return {
    variables: {
      agreementId,
      request: {
        newStreet,
      },
    },
  }
}
