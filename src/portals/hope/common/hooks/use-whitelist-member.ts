import gql from 'graphql-tag'
import { FetchResult } from '@apollo/client'
import { useWhitelistMemberMutation } from 'types/generated/graphql'

gql`
  mutation whitelistMember($memberId: ID!) {
    whitelistMember(memberId: $memberId) {
      memberId
      person {
        whitelisted {
          whitelistedAt
          whitelistedBy
        }
      }
    }
  }
`

interface UseWhitelistMemberResult {
  whitelist: (memberId: string) => Promise<FetchResult>
}

export const useWhitelistMember = (): UseWhitelistMemberResult => {
  const [whitelistMember] = useWhitelistMemberMutation()

  const whitelist = (memberId: string) =>
    whitelistMember({
      variables: {
        memberId,
      },
      refetchQueries: ['GetPerson'],
      optimisticResponse: {
        whitelistMember: {
          __typename: 'Member',
          memberId,
          person: {
            whitelisted: {
              whitelistedAt: new Date(),
              whitelistedBy: 'temp',
            },
          },
        },
      },
    })

  return {
    whitelist,
  }
}
