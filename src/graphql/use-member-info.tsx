import {
  GetMemberInfoQueryHookResult,
  Member,
  useGetMemberInfoQuery,
} from 'api/generated/graphql'

type MemberReturnTuple = [Member | undefined, GetMemberInfoQueryHookResult]

export const useMemberInfo = (memberId: string): MemberReturnTuple => {
  const queryResult = useGetMemberInfoQuery({
    variables: { memberId },
  })
  const member = queryResult.data?.member as Member
  return [member, queryResult]
}
