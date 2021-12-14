import {
  ListClaimsLazyQueryHookResult,
  ListClaimsOptions,
  ListClaimsResult,
  useListClaimsLazyQuery,
} from 'types/generated/graphql'

type ListClaimsReturnTuple = [
  ListClaimsResult,
  (options?: ListClaimsOptions) => void,
  ListClaimsLazyQueryHookResult[1],
]

export const useListClaims = (): ListClaimsReturnTuple => {
  const [listClaimsQuery, queryResult] = useListClaimsLazyQuery()

  const listClaims = (options?: ListClaimsOptions) => {
    const sortDirection =
      options?.sortDirection === 'ascending' ? 'ASC' : 'DESC'

    listClaimsQuery({
      variables: {
        options: {
          includeAll: options?.includeAll ?? false,
          page: options?.page ?? 0,
          pageSize: options?.pageSize ?? 20,
          sortBy: options?.sortBy ?? 'DATE',
          sortDirection,
          filterClaimStates: options?.filterClaimStates || null,
          filterCreatedBeforeOrOnDate:
            options?.filterCreatedBeforeOrOnDate || null,
          filterComplexities: options?.filterComplexities || null,
          filterNumberOfMemberGroups:
            options?.filterNumberOfMemberGroups || null,
          filterSelectedMemberGroups:
            options?.filterSelectedMemberGroups || null,
          filterMarkets: options?.filterMarkets || null,
          filterTypesOfContract: options?.filterTypesOfContract || null,
          filterClaimOutcomes: options?.filterClaimOutcomes || null,
        },
      },
    })
  }
  const { claims = [], page = 0, totalPages = 0, totalClaims = 0 } = {
    ...queryResult?.data?.listClaims,
  }

  const listClaimsResult = {
    claims,
    totalPages,
    page,
    totalClaims,
  }

  return [listClaimsResult as ListClaimsResult, listClaims, queryResult]
}
