import { signedOrExpiredPredicate, useQuotes } from 'graphql/use-quotes'
import * as React from 'react'
import styled from 'react-emotion'
import { Muted } from './common'
import { QuoteListItem } from './quote-list-item'

const Wrapper = styled('div')({
  padding: '1rem',
})
const Headline = styled('h1')({})

export const Quotes: React.FunctionComponent<{ memberId: string }> = ({
  memberId,
}) => {
  const [quotes, quotesLoading] = useQuotes(memberId)

  return (
    <Wrapper>
      <Headline>Quotes</Headline>
      {quotesLoading && 'Loading...'}
      {!quotesLoading && quotes.length === 0 && <em>No quotes :(</em>}
      {quotes
        .filter((quote) => !signedOrExpiredPredicate(quote))
        .map((quote) => (
          <QuoteListItem key={quote.id} quote={quote} memberId={memberId} />
        ))}

      <Headline>Signed/Expired quotes</Headline>
      <Muted>
        {quotes.filter(signedOrExpiredPredicate).map((quote) => (
          <QuoteListItem
            key={quote.id}
            quote={quote}
            memberId={memberId}
            inactionable
          />
        ))}
      </Muted>
    </Wrapper>
  )
}
