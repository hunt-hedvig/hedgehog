import gql from 'graphql-tag'
import {
  useWhitelistMemberInformationQuery,
  useWhitelistMemberMutation,
} from 'types/generated/graphql'

gql`
  mutation whitelistMember($memberId: ID!) {
    whitelistMember(memberId: $memberId) {
      memberId
      person {
        whitelisted {
          whitelistedAt
          whitelistedBy
        }
        status {
          whitelisted
        }
      }
    }
  }

  query WhitelistMemberInformation($memberId: ID!) {
    member(id: $memberId) {
      memberId
      person {
        status {
          whitelisted
        }
        debt {
          paymentDefaults {
            caseId
          }
          totalAmountDebt
        }
      }
    }
  }
`

interface UseWhitelistMemberResult {
  whitelist: () => Promise<void>
  eligible: boolean
}

export const useWhitelistMember = (
  memberId: string,
): UseWhitelistMemberResult => {
  const [whitelistMember] = useWhitelistMemberMutation()
  const { data } = useWhitelistMemberInformationQuery({
    variables: { memberId },
  })

  const person = data?.member?.person

  const isEligibleForWhitelist = () => {
    if (person?.status?.whitelisted) {
      return false
    }
    if ((person?.debt?.paymentDefaults?.length ?? 0) > 0) {
      return true
    }
    if ((person?.debt?.totalAmountDebt.amount ?? 0) > 0) {
      return true
    }

    return false
  }

  const whitelist = () =>
    new Promise<void>((resolve, reject) => {
      if (!isEligibleForWhitelist()) {
        reject()
      }

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
                whitelistedBy: '',
              },
              status: {
                whitelisted: true,
              },
            },
          },
        },
      })
        .then(() => resolve())
        .catch(() => reject())
    })

  return {
    whitelist,
    eligible: isEligibleForWhitelist(),
  }
}
