import { QuoteListItem } from 'components/chat/tabs/quotes/quote-list-item'
import { useQuotes } from 'components/chat/tabs/quotes/use-quotes'
import * as React from 'react'
import styled from 'react-emotion'

const Wrapper = styled('div')({
  padding: '1rem',
})
const Headline = styled('h1')({})

const notSignedOrExpiredPredicate = (quote) =>
  quote.state !== 'EXPIRED' && quote.state !== 'SIGNED'

export const Quotes: React.FunctionComponent<{ memberId: string }> = function({
  memberId,
}) {
  const [quotes, quotesLoading] = useQuotes(memberId)

  return (
    <Wrapper>
      <Headline>Quotes</Headline>
      {quotesLoading && 'Loading...'}
      {!quotesLoading &&
        quotes.filter(notSignedOrExpiredPredicate).length === 0 && (
          <em>No quotes :(</em>
        )}
      {quotes.filter(notSignedOrExpiredPredicate).map((quote) => (
        <QuoteListItem key={quote.id} quote={quote} />
      ))}
    </Wrapper>
  )
}
