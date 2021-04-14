import { MutationFunctionOptions } from '@apollo/client'
import {
  ClaimState,
  UpdateClaimStateMutation,
  UpdateClaimStateMutationHookResult,
  UpdateClaimStateMutationVariables,
  useUpdateClaimStateMutation,
} from 'api/generated/graphql'

export const useUpdateClaimState = (): UpdateClaimStateMutationHookResult =>
  useUpdateClaimStateMutation()

export const updateClaimStateOptions = (
  id: string,
  state: ClaimState,
): MutationFunctionOptions<
  UpdateClaimStateMutation,
  UpdateClaimStateMutationVariables
> => {
  return {
    variables: {
      id,
      state,
    },
  }
}
