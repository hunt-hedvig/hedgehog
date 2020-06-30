import { MutationFunctionOptions } from '@apollo/react-common'
import {
  ClaimState,
  Scalars,
  UpdateClaimStateMutation,
  UpdateClaimStateMutationHookResult,
  UpdateClaimStateMutationVariables,
  useUpdateClaimStateMutation,
} from 'api/generated/graphql'

export const useUpdateClaimState = (): UpdateClaimStateMutationHookResult =>
  useUpdateClaimStateMutation()

export const updateClaimStateOptions = (
  id: Scalars['ID'],
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
