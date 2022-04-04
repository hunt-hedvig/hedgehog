import styled from '@emotion/styled'
import { Button, Flex, Loadable, Placeholder } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import {
  convertEnumOrSentenceToTitle,
  convertEnumToTitle,
} from '@hedvig-ui/utils/text'
import chroma from 'chroma-js'
import copy from 'copy-to-clipboard'
import formatDate from 'date-fns/format'
import gql from 'graphql-tag'
import { Market, MarketLanguage } from 'portals/hope/features/config/constants'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  QuoteCartSearchHit,
  QuoteCartSearchQuotesQuery,
  useBypassUnderwritingGuidelinesMutation,
  useQuoteCartSearchQuotesQuery,
} from 'types/generated/graphql'

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
  query QuoteCartSearchQuotes($quoteIds: [String!]!) {
    quotes(ids: $quoteIds) {
      id
      market
      price
      currency
      createdAt
      state
      productType
      breachedUnderwritingGuidelines
      underwritingGuidelinesBypassed
    }
  }

  mutation BypassUnderwritingGuidelines($quoteIds: [ID!]!) {
    bypassUnderwritingGuidelines(quoteIds: $quoteIds) {
      id
      underwritingGuidelinesBypassed
    }
  }
`

const QuoteResultRow: React.FC<{
  quote: QuoteCartSearchQuotesQuery['quotes'][0]
}> = ({ quote }) => {
  const price = quote?.price
  const currency = quote?.currency
  const productType = quote?.productType
  const breachedGuidelines = quote?.breachedUnderwritingGuidelines ?? []

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
            <Loadable loading={!price || !currency}>
              {price ?? '123'} {currency ?? 'ABC'}
            </Loadable>
          </Flex>
        </Flex>
      </Flex>
    </>
  )
}

export const QuoteCartResult: React.FC<{ quoteCart: QuoteCartSearchHit }> = ({
  quoteCart: { id, quotes },
}) => {
  const { data } = useQuoteCartSearchQuotesQuery({
    variables: { quoteIds: quotes.map((quote) => quote.id) },
    fetchPolicy: 'cache-first',
  })

  const [bypassQuotes] = useBypassUnderwritingGuidelinesMutation()
  const { confirm } = useConfirmDialog()

  const firstQuotePreview = quotes[0]
  const firstQuote = data?.quotes?.at(0)

  const fullName = firstQuotePreview?.fullName
  const createdAt = firstQuote?.createdAt
  const state = firstQuote?.state

  const hasBypassedUwgl = data?.quotes?.every(
    (quote) => quote.underwritingGuidelinesBypassed,
  )

  const geoInfo = [
    firstQuotePreview?.street,
    firstQuotePreview?.city,
    firstQuotePreview?.postalCode,
  ].filter((q) => !!q)

  return (
    <Wrapper>
      <Flex align="center" justify="space-between">
        <Flex direction="column">
          <div className="full-name">
            {fullName ?? <Placeholder>Name not available</Placeholder>}
          </div>
          <div className="ssn">
            {firstQuotePreview?.ssn ?? (
              <Placeholder>SSN not available</Placeholder>
            )}
          </div>
        </Flex>
        <Button
          disabled={!firstQuote}
          onClick={() => {
            if (hasBypassedUwgl && firstQuote) {
              copy(
                `${process.env.HEDVIG_ONBOARDING_URL}/${
                  MarketLanguage[firstQuote.market as Market]
                }/new-member/offer/${id}`,
              )
              toast.success('Copied offer page link')
              return
            }
            confirm(
              'Are you sure you want to allow the member to sign this cart?',
            ).then(() => {
              toast.promise(
                bypassQuotes({
                  variables: {
                    quoteIds: quotes.map((quote) => quote.id),
                  },
                  optimisticResponse: {
                    bypassUnderwritingGuidelines: quotes.map((quote) => ({
                      id: quote.id,
                      underwritingGuidelinesBypassed: true,
                      __typename: 'Quote',
                    })),
                  },
                }),
                {
                  success:
                    'Quote cart signable, please send the link to the member',
                  loading: 'Making quote cart signable',
                  error: 'Unable to make quote cart signable',
                },
              )
            })
          }}
        >
          {hasBypassedUwgl ? 'Copy link' : 'Make signable'}
        </Button>
      </Flex>
      <Flex className="quotes" direction="column" fullWidth>
        {data?.quotes.map((quote) => (
          <QuoteResultRow quote={quote} />
        ))}
      </Flex>
      <Flex
        style={{ marginTop: '1rem', padding: '0 0.75rem' }}
        justify="space-between"
      >
        <div style={{ minWidth: '50%' }}>
          <SmallLabel>Address</SmallLabel>
          {geoInfo.length !== 0 ? (
            <div>{geoInfo.join(', ')}</div>
          ) : (
            <Placeholder>Not available</Placeholder>
          )}
        </div>
        <Flex justify="flex-end">
          <div style={{ marginLeft: '2rem', marginRight: '2rem' }}>
            <SmallLabel>Created at</SmallLabel>
            {createdAt ? (
              <div>{formatDate(new Date(createdAt), 'yyyy-MM-dd')}</div>
            ) : (
              <Placeholder>Not available</Placeholder>
            )}
          </div>
          <Flex direction="column" align="flex-end">
            <SmallLabel>State</SmallLabel>
            {state ? (
              <div>{convertEnumOrSentenceToTitle(state)}</div>
            ) : (
              <Placeholder>Not available</Placeholder>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Wrapper>
  )
}
