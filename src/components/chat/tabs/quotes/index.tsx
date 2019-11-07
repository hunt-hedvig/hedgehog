import { useQuery } from '@apollo/react-hooks'
import { colorsV2 } from '@hedviginsurance/brand'
import { gql } from 'apollo-boost'
import { ApartmentQuoteData, HouseQuoteData, QuoteData, QuoteResponseEntity } from 'components/chat/tabs/quotes/data'
import { Quote } from 'components/chat/tabs/quotes/quote'
import { formatMoney, formatMoneySE } from 'lib/intl'
import * as React from 'react'
import { useState, useEffect } from 'react'
import styled from 'react-emotion'

const Wrapper = styled('div')({
  padding: '1rem',
})
const Headline = styled("h1")({})

const notSignedOrExpiredPredicate = (quote) => quote.state !== 'EXPIRED' && quote.state !== 'SIGNED'

const QUOTES_QUERY = gql`
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
      {!loading && quotes.filter(notSignedOrExpiredPredicate).length === 0 && <em>No quotes :(</em>}
      {quotes
      .filter(notSignedOrExpiredPredicate)
      .map((quote) => (
        <Quote key={quote.id} quote={quote} />
      ))}
    </Wrapper>
  )
}
