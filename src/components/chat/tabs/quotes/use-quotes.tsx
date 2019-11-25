import { useQuery } from '@apollo/react-hooks'
import { Member, Quote } from 'api/generated/graphql'
import { gql } from 'apollo-boost'
import { parseISO } from 'date-fns'

export const QUOTES_QUERY = gql`
  query Quotes($memberId: ID!) {
    member(id: $memberId) {
      quotes {
        id
        price
        productType
        state
        startDate
        validity
        isComplete
        createdAt
        breachedUnderwritingGuidelines
        originatingProductId
        signedProductId
        data {
          ... on ApartmentQuoteData {
            street
            zipCode
            city
            householdSize
            livingSpace
            subType
          }

          ... on HouseQuoteData {
            street
            zipCode
            city
            householdSize
            livingSpace
            ancillaryArea
            yearOfConstruction
            numberOfBathrooms
            extraBuildings {
              type
              area
              hasWaterConnected
            }
            isSubleted
          }
        }
      }
    }
  }
`

const latest = (a: Quote, b: Quote) =>
  Number(parseISO(b.createdAt)) - Number(parseISO(a.createdAt))

export const signedOrExpiredPredicate = (quote) =>
  quote.state === 'EXPIRED' || quote.state === 'SIGNED'

export const useQuotes = function(
  memberId: string,
): [ReadonlyArray<Quote>, boolean] {
  const { data, loading } = useQuery<{ member: { quotes: Member['quotes'] } }>(
    QUOTES_QUERY,
    {
      variables: { memberId },
    },
  )
  const quotes = [...(data?.member?.quotes ?? [])].sort(latest)

  return [quotes, loading]
}
