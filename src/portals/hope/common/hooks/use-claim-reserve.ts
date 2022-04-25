import gql from 'graphql-tag'
import {
  useClaimReserveQuery,
  useUpdateClaimReserveMutation,
} from 'types/generated/graphql'

gql`
  query ClaimReserve($claimId: ID!) {
    claim(id: $claimId) {
      id
      reserves
    }
  }

  mutation UpdateClaimReserve($claimId: ID!, $amount: MonetaryAmount!) {
    updateReserve(id: $claimId, amount: $amount) {
      id
      reserves
    }
  }
`

export const useClaimReserve = (claimId: string) => {
  const [updateReserve] = useUpdateClaimReserveMutation()
  const { data } = useClaimReserveQuery({
    variables: { claimId },
  })

  const reserve = {
    amount: Math.round(Number(data?.claim?.reserves?.amount ?? 0)),
    currency: data?.claim?.reserves?.currency ?? 'SEK',
  }

  const setReserveHandler = (value: string) =>
    updateReserve({
      variables: {
        claimId,
        amount: {
          amount: value,
          currency: 'SEK',
        },
      },
      optimisticResponse: {
        updateReserve: {
          id: claimId,
          __typename: 'Claim',
          reserves: {
            amount: value,
            currency: 'SEK',
          },
        },
      },
    })

  return {
    reserve,
    setReserve: setReserveHandler,
  }
}
