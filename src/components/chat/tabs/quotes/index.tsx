import { QuoteListItem } from 'components/chat/tabs/quotes/quote-list-item'
import { signedOrExpiredPredicate, useQuotes } from 'components/chat/tabs/quotes/use-quotes'
import * as React from 'react'
import styled from 'react-emotion'

const Wrapper = styled('div')({
  padding: '1rem',
})
const Headline = styled('h1')({})

const Muted = styled('div')({
  opacity: .5,
})

export const Quotes: React.FunctionComponent<{ memberId: string }> = function({
  memberId,
}) {
  const [quotes, quotesLoading] = useQuotes(memberId)

  return (
    <Wrapper>
      <Headline>Quotes</Headline>
      {quotesLoading && 'Loading...'}
      {!quotesLoading &&
        quotes.length === 0 && (
          <em>No quotes :(</em>
        )}
      {quotes.filter(quote => !signedOrExpiredPredicate(quote)).map((quote) => (
        <QuoteListItem key={quote.id} quote={quote} />
      ))}

      <Headline>Signed/Expired quotes</Headline>
      <Muted>
        {quotes.filter(signedOrExpiredPredicate).map((quote) => (
          <QuoteListItem key={quote.id} quote={quote} inactionable />
        ))}
      </Muted>
    </Wrapper>
  )
}
