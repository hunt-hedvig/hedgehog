import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { parseISO } from 'date-fns'
import { Member, Quote } from 'src/api/generated/graphql'

export const QUOTES_QUERY = gql`
  query Quotes($memberId: ID!) {
    member(id: $memberId) {
      memberId

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
        isReadyToSign
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

          ... on NorwegianHomeContentQuoteData {
            street
            zipCode
            city
            householdSize
            livingSpace
            norwegianHomeContentSubType: subType
          }

          ... on NorwegianTravelQuoteData {
            householdSize
            norwegianTravelSubType: subType
          }
        }
      }
    }
  }
`

const latest = (a: Quote, b: Quote) =>
  Number(parseISO(b.createdAt)) - Number(parseISO(a.createdAt))

export const signedOrExpiredPredicate = (quote) =>
  expiredPredicate(quote) || signedPredicate(quote)

export const expiredPredicate = (quote) => {
  const createdAt = new Date(quote.createdAt)
  const now = new Date()

  createdAt.setSeconds(quote.validity)

  return now > createdAt
}

export const signedPredicate = (quote) => quote.state === 'SIGNED'

export const useQuotes = (
  memberId: string,
): [ReadonlyArray<Quote>, boolean] => {
  const { data, loading } = useQuery<{ member: { quotes: Member['quotes'] } }>(
    QUOTES_QUERY,
    {
      variables: { memberId },
    },
  )
  const quotes = [...(data?.member?.quotes ?? [])].sort(latest)

  return [quotes, loading]
}
