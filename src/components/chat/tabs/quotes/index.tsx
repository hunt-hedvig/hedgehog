import { useQuery } from '@apollo/react-hooks'
import { gql } from 'apollo-boost'
import { ApartmentQuoteData, HouseQuoteData, QuoteResponseEntity } from 'components/chat/tabs/quotes/data'
import { QuoteListItem } from 'components/chat/tabs/quotes/quote-list-item'
import { parseISO } from 'date-fns'
import * as React from 'react'
import styled from 'react-emotion'

const Wrapper = styled('div')({
  padding: '1rem',
})
const Headline = styled("h1")({})

const notSignedOrExpiredPredicate = (quote) => quote.state !== 'EXPIRED' && quote.state !== 'SIGNED'
const now = new Date()
const latest = (a: QuoteResponseEntity<any>, b: QuoteResponseEntity<any>) =>
  parseISO(b.createdAt) - parseISO(a.createdAt)

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
        data {

          ...on ApartmentQuoteData {
            street
            zipCode
            city
            householdSize
            livingSpace
          }

          ...on HouseQuoteData {
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

type QuotesGqlType = { member: { quotes: ReadonlyArray<QuoteResponseEntity<ApartmentQuoteData | HouseQuoteData>> } }
export const Quotes: React.FunctionComponent<{ memberId: string }> = function ({ memberId }) {
  const { data, loading } = useQuery<QuotesGqlType>(QUOTES_QUERY, { variables: { memberId } })
  const quotes = (data && data.member && data.member.quotes) ?? []

  return (
    <Wrapper>
      <Headline>Quotes</Headline>
      {loading && 'Loading...'}
      {!loading && quotes
      .filter(notSignedOrExpiredPredicate)
        .length === 0 && <em>No quotes :(</em>}
      {quotes
      .filter(notSignedOrExpiredPredicate)
      .sort(latest)
      .map((quote) => (
        <QuoteListItem key={quote.id} quote={quote} />
      ))}
    </Wrapper>
  )
}
