import {
  MemberSearchOptions,
  MemberSearchQueryHookResult,
  MemberSearchResult,
  useMemberSearchQuery,
} from 'api/generated/graphql'

type MemberSearchReturnTuple = [
  MemberSearchResult | undefined,
  MemberSearchQueryHookResult,
]

export const useMemberSearch = (
  query: string,
  options?: MemberSearchOptions,
): MemberSearchReturnTuple => {
  const queryResult = useMemberSearchQuery({
    variables: {
      query,
      options: {
        includeAll: options?.includeAll ?? false,
        page: options?.page ?? 0,
        pageSize: options?.pageSize ?? 25,
        sortBy: options?.sortBy ?? 'SIGN_UP',
        sortDirection: options?.sortDirection ?? 'DESC',
      },
    },
  })
  const memberSearchResult = queryResult.data?.memberSearch as
    | MemberSearchResult
    | undefined
  return [memberSearchResult, queryResult]
}
