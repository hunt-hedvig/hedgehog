import gql from 'graphql-tag'
import { useMemberNameQuery } from 'types/generated/graphql'

gql`
  query MemberName($memberId: ID!) {
    member(id: $memberId) {
      memberId
      firstName
      lastName
    }
  }
`

export const useMemberName = (memberId: string) => {
  const { data } = useMemberNameQuery({
    variables: { memberId },
    fetchPolicy: 'cache-first',
  })

  const firstName = data?.member?.firstName ?? null
  const lastName = data?.member?.lastName ?? null
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : null

  return {
    firstName,
    lastName,
    fullName,
  }
}
