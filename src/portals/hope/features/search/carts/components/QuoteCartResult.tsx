import React from 'react'
import {
  QuoteCartSearchHit,
  QuoteSearchHit,
  useQuoteSearchQuoteQuery,
} from 'types/generated/graphql'
import styled from '@emotion/styled'
import { Button, Flex, Loadable, Placeholder } from '@hedvig-ui'
import chroma from 'chroma-js'
import gql from 'graphql-tag'
import {
  convertEnumOrSentenceToTitle,
  convertEnumToTitle,
} from '@hedvig-ui/utils/text'

const Wrapper = styled.div`
  margin-bottom: 1rem;
  border-radius: 0.25rem;
  padding: 2rem;
  background-color: ${({ theme }) =>
    chroma(theme.backgroundTransparent).brighten(3).hex()};
  max-width: 60rem;

  .full-name {
    font-size: 1.3rem;
  }

  .ssn {
    font-size: 0.9rem;
    color: ${({ theme }) => theme.semiStrongForeground};
  }

  .quote-row {
    padding: 0 0.75rem;
    margin-bottom: 1.5rem;

    :last-of-type {
      margin-bottom: 0.5rem;
    }

    :first-of-type {
      margin-top: 0.5rem;
    }
  }

  .quotes {
    padding: 0.5rem 0;
    font-size: 1.1rem;
    margin-top: 1.5rem;

    border-top: 1px solid
      ${({ theme }) => chroma(theme.semiStrongForeground).brighten(3).hex()};
    border-bottom: 1px solid
      ${({ theme }) => chroma(theme.semiStrongForeground).brighten(3).hex()};
  }

  .quote-product-type {
    font-size: 1.1rem;

    color: ${({ theme }) => theme.semiStrongForeground};
  }
`

const SmallLabel = styled.span`
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  color: ${({ theme }) => chroma(theme.semiStrongForeground).brighten(1).hex()};
`

const BreachedGuidelineTag = styled.div`
  color: ${({ theme }) => theme.accentContrast};
  background-color: ${({ theme }) => theme.danger};
  padding: 0.25rem 0.45rem;
  border-radius: 0.5rem;
  font-size: 0.85rem;
  text-align: center;
`

gql`
  query QuoteCartSearchQuote($id: String!) {
    quote(id: $id) {
      id
      price
      currency
      createdAt
      state
      productType
      breachedUnderwritingGuidelines
    }
  }
`

const QuoteResultRow: React.FC<{ quote: QuoteSearchHit }> = ({ quote }) => {
  const { data, loading } = useQuoteSearchQuoteQuery({
    variables: { id: quote.id ?? '' },
  })

  const price = data?.quote?.price
  const currency = data?.quote?.currency
  const productType = data?.quote?.productType
  const breachedGuidelines = data?.quote?.breachedUnderwritingGuidelines ?? []

  return (
    <>
      <Flex className="quote-row">
        <Flex direction="column">
          <SmallLabel>Product type</SmallLabel>
          <Flex>
            {productType ? (
              convertEnumOrSentenceToTitle(productType)
            ) : (
              <Placeholder>No product type</Placeholder>
            )}
          </Flex>
        </Flex>
        <Flex direction="column" justify="flex-end">
          <SmallLabel>Breached guidelines</SmallLabel>
          <Flex>
            {breachedGuidelines.length !== 0 ? (
              breachedGuidelines.map((guideline) => (
                <BreachedGuidelineTag key={guideline + quote.id}>
                  {convertEnumToTitle(guideline)}
                </BreachedGuidelineTag>
              ))
            ) : (
              <Placeholder>None</Placeholder>
            )}
          </Flex>
        </Flex>
        <Flex direction="column" align="flex-end">
          <SmallLabel>Price</SmallLabel>
          <Flex justify="flex-end">
            <Loadable loading={loading || !price || !currency}>
              {price ?? '123'} {currency ?? 'ABC'}
            </Loadable>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export const QuoteCartResult: React.FC<{ quoteCart: QuoteCartSearchHit }> = ({
  quoteCart: { quotes },
}) => {
  const firstQuote = () => {
    if (quotes.length === 0) {
      return null
    }

    return quotes[0]
  }
  const fullName = firstQuote()?.fullName

  return (
    <Wrapper>
      <Flex align="center" justify="space-between">
        <Flex direction="column">
          <div className="full-name">
            {fullName ?? <Placeholder>Name not available</Placeholder>}
          </div>
          <div className="ssn">
            {firstQuote()?.ssn ?? <Placeholder>SSN not available</Placeholder>}
          </div>
        </Flex>
        <Button disabled={true}>Sign</Button>
      </Flex>
      <Flex className="quotes" direction="column" fullWidth>
        {quotes.map((quote) => (
          <QuoteResultRow quote={quote} />
        ))}
      </Flex>
    </Wrapper>
  )
}
