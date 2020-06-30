import { MutationFunctionOptions } from '@apollo/react-common'
import {
  AddContractIdToClaim,
  AddContractIdToClaimMutation,
  AddContractIdToClaimMutationHookResult,
  AddContractIdToClaimMutationVariables,
  GetClaimsDocument,
  useAddContractIdToClaimMutation,
} from 'api/generated/graphql'

export const useAddContractIdToClaim = (): AddContractIdToClaimMutationHookResult =>
  useAddContractIdToClaimMutation()

export const addContractIdToClaimOptions = (
  request: AddContractIdToClaim,
): MutationFunctionOptions<
  AddContractIdToClaimMutation,
  AddContractIdToClaimMutationVariables
> => {
  return {
    variables: {
      request,
    },
    refetchQueries: () => [
      {
        query: GetClaimsDocument,
        variables: { id: request.claimId },
      },
    ],
  }
}
