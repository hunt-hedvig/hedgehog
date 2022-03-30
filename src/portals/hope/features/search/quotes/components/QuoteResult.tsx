import React from 'react'
import styled from '@emotion/styled'
import chroma from 'chroma-js'
import {
  QuoteSearchHit,
  useQuoteSearchQuoteQuery,
} from 'types/generated/graphql'
import { Flex, Label, Loadable } from '@hedvig-ui'
import gql from 'graphql-tag'
import formatDate from 'date-fns/format'
import {
  convertEnumOrSentenceToTitle,
  convertEnumToTitle,
} from '@hedvig-ui/utils/text'

const Wrapper = styled.div`
  max-width: 60rem;
  padding: 2rem;
  background-color: ${({ theme }) =>
    chroma(theme.backgroundTransparent).alpha(0.05).hex()};

  h3 {
    font-size: 1.6rem;
    margin-bottom: 0;
  }

  h4 {
    margin-bottom: 0;
    color: ${({ theme }) => theme.semiStrongForeground};
  }

  .type {
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(0.5).hex()};
    font-size: 1.1rem;
    margin-bottom: 0;
  }

  .type-placeholder {
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1).hex()};
    font-size: 1.1rem;
    margin-bottom: 0;
  }

  .name {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }

  .name-placeholder {
    font-size: 1.6rem;
    margin-bottom: 1rem;
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1.75).hex()};
  }

  .labeled-information {
    min-width: 8rem;
    margin-bottom: 0;
    color: ${({ theme }) => theme.semiStrongForeground};
  }

  .labeled-information-placeholder {
    min-width: 8rem;
    margin-bottom: 0;
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1.75).hex()};
  }

  .price {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }

  margin-bottom: 2rem;
  border-radius: 0.25rem;
`

gql`
  query QuoteSearchQuote($id: String!) {
    quote(id: $id) {
      id
      price
      currency
      createdAt
      memberId
      state
      productType
      breachedUnderwritingGuidelines
    }
  }
`

const SmallLabel = styled(Label)`
  font-size: 0.8rem;
  margin-bottom: -0.2rem;
  margin-top: 0.2rem;
  color: ${({ theme }) => chroma(theme.semiStrongForeground).brighten(1).hex()};
`

const BreachedGuidelineTag = styled.div`
  color: ${({ theme }) => theme.accentContrast};
  background-color: ${({ theme }) => theme.danger};
  padding: 0.25rem 0.45rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  text-align: center;
`

export const QuoteResult: React.FC<{
  quote: QuoteSearchHit
}> = ({ quote }) => {
  const { data, loading } = useQuoteSearchQuoteQuery({
    variables: { id: quote.id ?? '' },
  })

  const price = data?.quote?.price
  const currency = data?.quote?.currency
  const createdAt = data?.quote?.createdAt
  const state = data?.quote?.state
  const productType = data?.quote?.productType
  const breachedGuidelines = data?.quote?.breachedUnderwritingGuidelines ?? []

  const geoInfo = [quote?.street, quote?.city, quote?.postalCode].filter(
    (q) => !!q,
  )

  return (
    <Wrapper>
      <Flex justify="space-between">
        <Flex direction="column">
          {productType ? (
            <div className="type">
              {convertEnumOrSentenceToTitle(productType)}
            </div>
          ) : (
            <div className="type-placeholder">No product type</div>
          )}

          {quote?.fullName && quote?.fullName !== ' ' ? (
            <div className="name">{quote?.fullName}</div>
          ) : (
            <div className="name-placeholder">Name not available</div>
          )}

          <Flex style={{ marginTop: '1rem' }}>
            <div>
              <SmallLabel>SSN</SmallLabel>
              {quote?.ssn ? (
                <div className="labeled-information">{quote?.ssn}</div>
              ) : (
                <div className="labeled-information-placeholder">
                  Not available
                </div>
              )}
            </div>
            <div style={{ marginLeft: '2rem' }}>
              <SmallLabel>Member ID</SmallLabel>
              {quote?.memberId ? (
                <div className="labeled-information">
                  <a href={`/members/${quote.memberId}`}>{quote.memberId}</a>
                </div>
              ) : (
                <div className="labeled-information-placeholder">
                  Not available
                </div>
              )}
            </div>
            <div style={{ marginLeft: '2rem' }}>
              <SmallLabel>Created at</SmallLabel>
              {createdAt ? (
                <div className="labeled-information">
                  {formatDate(new Date(createdAt), 'yyyy-MM-dd')}
                </div>
              ) : (
                <div className="labeled-information-placeholder">
                  Not available
                </div>
              )}
            </div>
            <div style={{ marginLeft: '2rem' }}>
              <SmallLabel>State</SmallLabel>
              {state ? (
                <div className="labeled-information">
                  {convertEnumOrSentenceToTitle(state)}
                </div>
              ) : (
                <div className="labeled-information-placeholder">
                  Not available
                </div>
              )}
            </div>
          </Flex>

          <Flex style={{ marginTop: '1rem' }}>
            <div>
              <SmallLabel>Address</SmallLabel>
              {geoInfo.length !== 0 ? (
                <div className="labeled-information">{geoInfo.join(', ')}</div>
              ) : (
                <div className="labeled-information-placeholder">
                  Not available
                </div>
              )}
            </div>
            {breachedGuidelines.length !== 0 && (
              <div style={{ marginLeft: '2rem' }}>
                <SmallLabel>Breached guidelines</SmallLabel>
                <Flex>
                  {breachedGuidelines.map((guideline) => (
                    <BreachedGuidelineTag key={guideline + quote.id}>
                      {convertEnumToTitle(guideline)}
                    </BreachedGuidelineTag>
                  ))}
                </Flex>
              </div>
            )}
          </Flex>
        </Flex>
        <Flex direction="column" justify="space-between" align="flex-end">
          <Loadable loading={loading || !price || !currency}>
            <div className="price">
              {price ?? '123'} {currency ?? 'ABC'}
            </div>
          </Loadable>
        </Flex>
      </Flex>
    </Wrapper>
  )
}
