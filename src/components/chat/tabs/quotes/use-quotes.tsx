import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { ApartmentQuoteData, HouseQuoteData, QuoteResponseEntity } from './data'
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
              displayName
            }
            isSubleted
          }
        }
      }
    }
  }
`
type QuotesGqlType = {
  member: {
    quotes: ReadonlyArray<
      QuoteResponseEntity<ApartmentQuoteData | HouseQuoteData>
    >
  }
}

const latest = (a: QuoteResponseEntity<any>, b: QuoteResponseEntity<any>) =>
  parseISO(b.createdAt) - parseISO(a.createdAt)

export const signedOrExpiredPredicate = (quote) =>
  quote.state === 'EXPIRED' || quote.state === 'SIGNED'

export const useQuotes = function(
  memberId: string,
): [
  ReadonlyArray<QuoteResponseEntity<ApartmentQuoteData | HouseQuoteData>>,
  boolean,
] {
  const { data, loading } = useQuery<QuotesGqlType>(QUOTES_QUERY, {
    variables: { memberId },
  })
  const quotes = [...(data?.member?.quotes ?? [])].sort(latest)

  return [quotes, loading]
}
