import {
  ListClaimsOptions,
  ListClaimsQueryHookResult,
  ListClaimsResult,
  useListClaimsLazyQuery,
} from 'api/generated/graphql'

type ListClaimsReturnTuple = [
  ListClaimsResult,
  (options?: ListClaimsOptions) => void,
  ListClaimsQueryHookResult,
]

export const useListClaims = (): ListClaimsReturnTuple => {
  const [listClaimsQuery, queryResult] = useListClaimsLazyQuery()

  const listClaims = (options?: ListClaimsOptions) => {
    listClaimsQuery({
      variables: {
        options: {
          includeAll: options?.includeAll ?? false,
          page: options?.page ?? 0,
          pageSize: options?.pageSize ?? 20,
          sortBy: options?.sortBy ?? 'DATE',
          sortDirection: options?.sortDirection ?? 'DESC',
        },
      },
    })
  }
  const { claims = [], page = 0, totalPages = 0 } = {
    ...queryResult?.data?.listClaims,
  }

  const listClaimsResult = {
    claims,
    totalPages,
    page,
  }

  return [listClaimsResult as ListClaimsResult, listClaims, queryResult]
}
