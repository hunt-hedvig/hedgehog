import {
  GetMemberInfoQueryResult,
  Member,
  useGetMemberInfoQuery,
} from 'types/generated/graphql'

type UseGetMemberInfoReturnTuple = [
  Member | undefined,
  GetMemberInfoQueryResult,
]

export const useGetMemberInfo = (
  memberId: string,
): UseGetMemberInfoReturnTuple => {
  const queryResult = useGetMemberInfoQuery({
    variables: {
      memberId,
    },
  })
  const member = queryResult?.data?.member as Member | undefined
  return [member, queryResult]
}
