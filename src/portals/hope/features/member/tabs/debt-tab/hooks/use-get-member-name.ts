import {
  GetMemberNameQueryHookResult,
  useGetMemberNameQuery,
} from 'types/generated/graphql'

type GetPersonReturnTuple = [
  MemberName | undefined,
  GetMemberNameQueryHookResult,
]

interface MemberName {
  firstName: string
  lastName: string
}

export const useGetMemberName = (memberId: string): GetPersonReturnTuple => {
  const queryResult = useGetMemberNameQuery({
    variables: {
      memberId,
    },
    fetchPolicy: 'cache-first',
  })
  const name = queryResult.data?.member as MemberName | undefined
  return [name, queryResult]
}
