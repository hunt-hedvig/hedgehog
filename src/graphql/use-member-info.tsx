import {
  GetMemberInfoQueryHookResult,
  Member,
  useGetMemberInfoQuery,
} from '../api/generated/graphql'

type MemberReturnTuple = [ReadonlyArray<Member>, GetMemberInfoQueryHookResult]

export const useMemberInfo = (memberId: string): MemberReturnTuple => {
  const queryResult = useGetMemberInfoQuery({
    variables: { memberId },
  })
  const member = (queryResult.data?.member ?? []) as Member[]
  return [member, queryResult]
}
