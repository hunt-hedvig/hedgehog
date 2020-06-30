import { MutationFunctionOptions } from '@apollo/react-common'
import {
  AddContractIdToClaim,
  AddContractIdToClaimMutation,
  AddContractIdToClaimMutationHookResult,
  AddContractIdToClaimMutationVariables,
  useAddContractIdToClaimMutation,
} from 'api/generated/graphql'
import { CLAIM_PAGE_QUERY } from 'components/claims/claim-details/data'

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
        query: CLAIM_PAGE_QUERY,
        variables: { id: request.claimId },
      },
    ],
  }
}
