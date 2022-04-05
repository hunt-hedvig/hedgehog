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

export const useClaimRegistrationDate = (claimId: string) => {
  const { data } = useClaimRegistrationDateQuery({
    variables: { claimId },
    fetchPolicy: 'cache-first',
  })

  return data?.claim?.registrationDate
}
