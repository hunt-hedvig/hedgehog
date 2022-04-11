import gql from 'graphql-tag'
import { useClaimRegistrationDateQuery } from 'types/generated/graphql'

gql`
  query ClaimRegistrationDate($claimId: ID!) {
    claim(id: $claimId) {
      id
      registrationDate
    }
  }
`

export const useClaimRegistrationDate = (claimId: string | null) => {
  const { data } = useClaimRegistrationDateQuery({
    variables: { claimId: claimId ?? '' },
    fetchPolicy: 'cache-first',
    skip: !claimId,
  })

  return data?.claim?.registrationDate
}
