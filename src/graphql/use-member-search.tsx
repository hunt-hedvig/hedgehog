import {
  MemberSearchOptions,
  MemberSearchQueryHookResult,
  useMemberSearchLazyQuery,
} from '../api/generated/graphql'

type MemberSearchReturnTuple = [
  (query: string, options?: MemberSearchOptions) => void,
  MemberSearchQueryHookResult,
]

export const useMemberSearch = (): MemberSearchReturnTuple => {
  const [memberSearchQuery, queryResult] = useMemberSearchLazyQuery()

  const memberSearch = (query: string, options?: MemberSearchOptions) => {
    memberSearchQuery({
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
  }

  return [memberSearch, queryResult]
}
