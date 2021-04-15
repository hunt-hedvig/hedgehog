import { MutationFunctionOptions } from '@apollo/client'
import {
  SetContractForClaim,
  SetContractForClaimMutation,
  SetContractForClaimMutationHookResult,
  SetContractForClaimMutationVariables,
  useSetContractForClaimMutation,
} from 'api/generated/graphql'

export const useSetContractForClaim = (): SetContractForClaimMutationHookResult =>
  useSetContractForClaimMutation()

export const setContractForClaimOptions = (
  request: SetContractForClaim,
): MutationFunctionOptions<
  SetContractForClaimMutation,
  SetContractForClaimMutationVariables
> => {
  return {
    variables: {
      request,
    },
  }
}
