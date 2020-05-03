import {
  ClaimItem,
  GetClaimItemsQueryHookResult,
  useGetClaimItemsQuery,
} from 'api/generated/graphql'

type GetClaimItemsReturnTuple = [ClaimItem[], GetClaimItemsQueryHookResult]

export const useGetClaimItems = (claimId: string): GetClaimItemsReturnTuple => {
  const queryResult = useGetClaimItemsQuery({
    variables: {
      claimId,
    },
  })
  const claimItems = (queryResult.data?.claimItems ?? []) as ClaimItem[]
  return [claimItems, queryResult]
}
