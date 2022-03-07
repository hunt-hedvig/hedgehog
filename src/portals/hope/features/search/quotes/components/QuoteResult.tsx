import React from 'react'
import styled from '@emotion/styled'
import chroma from 'chroma-js'
import { QuoteSearchHit } from 'types/generated/graphql'
import { Button, Flex } from '@hedvig-ui'

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

  .name {
    font-size: 1.6rem;
    margin-bottom: 0;
  }

  .name-placeholder {
    font-size: 1.6rem;
    margin-bottom: 0;
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1.75).hex()};
  }

  .ssn {
    margin-bottom: 0;
    color: ${({ theme }) => theme.semiStrongForeground};
  }

  .ssn-placeholder {
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

export const QuoteResult: React.FC<{ quote: QuoteSearchHit }> = ({ quote }) => {
  const geoInfo = [quote?.street, quote?.city, quote?.postalCode].filter(
    (q) => !!q,
  )

  return (
    <Wrapper>
      <Flex justify="space-between">
        <Flex direction="column">
          {quote?.fullName ? (
            <div className="name">{quote?.fullName}</div>
          ) : (
            <div className="name-placeholder">Name not available</div>
          )}

          {quote?.ssn ? (
            <div className="ssn">{quote?.ssn}</div>
          ) : (
            <div className="ssn-placeholder">SSN not available</div>
          )}

          <h5>{geoInfo.join(' • ')}</h5>
        </Flex>
        <Flex direction="column" justify="space-between" align="flex-end">
          <div className="price">159 SEK</div>
          <Button variant="secondary">Details</Button>
        </Flex>
      </Flex>
    </Wrapper>
  )
}
