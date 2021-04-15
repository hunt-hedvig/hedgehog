import {
  Claim,
  GetMemberClaimsQueryResult,
  useGetMemberClaimsQuery,
} from 'api/generated/graphql'
import { parseISO } from 'date-fns'

type UseGetMemberClaimsReturnTuple = [
  ReadonlyArray<Claim> | undefined,
  GetMemberClaimsQueryResult,
]

export const useGetMemberClaims = (
  memberId: string,
): UseGetMemberClaimsReturnTuple => {
  const queryResult = useGetMemberClaimsQuery({
    variables: {
      memberId,
    },
  })
  let claims = queryResult?.data?.member?.claims as Claim[] | undefined
  if (Array.isArray(claims)) {
    claims = [...claims].sort(
      (a, b) => +parseISO(b.registrationDate) - +parseISO(a.registrationDate),
    )
  }
  console.log(claims)
  return [claims, queryResult]
}
