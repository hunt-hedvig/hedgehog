import { MutationFunctionOptions } from '@apollo/react-common'
import {
  SetContractForClaim,
  SetContractForClaimMutation,
  SetContractForClaimMutationHookResult,
  SetContractForClaimMutationVariables,
  useSetContractForClaimMutation,
} from 'api/generated/graphql'
import { CLAIM_PAGE_QUERY } from 'components/claims/claim-details/data'

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
    refetchQueries: () => [
      {
        query: CLAIM_PAGE_QUERY,
        variables: { id: request.claimId },
      },
    ],
  }
}
