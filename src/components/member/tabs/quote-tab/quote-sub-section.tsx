import { Quote } from 'api/generated/graphql'
import { signedOrExpiredPredicate, signedPredicate } from 'graphql/use-quotes'
import { Button } from 'hedvig-ui/button'
import React from 'react'
import styled from 'react-emotion'
import { showNotification } from 'store/actions/notificationsActions'
import { ActionsWrapper, Muted } from './common'
import { QuoteListItem } from './quote-list-item'
import { QuoteModification } from './quote-modification'

const Headline = styled('h1')({})
const Wrapper = styled('div')({
  padding: '1rem',
})

export const QuotesSubSection: React.FunctionComponent<{
  memberId: string
  quotes: ReadonlyArray<Quote>
}> = ({ memberId, quotes }) => {
  const [isWip, setIsWip] = React.useState(false)
  const activeQuotes = quotes.filter(
    (quote) => !signedOrExpiredPredicate(quote),
  )
  const signedQuotes = quotes.filter(signedPredicate)
  const hasActiveQuotes = activeQuotes.length > 0
  const hasSignedQuotes = signedQuotes.length > 0

  return (
    <Wrapper>
      {!hasActiveQuotes && !hasSignedQuotes && (
        <Button onClick={() => setIsWip(!isWip)}>Create</Button>
      )}
      {!hasActiveQuotes && !hasSignedQuotes && isWip && (
        <ActionsWrapper>
          <QuoteModification
            quote={null}
            memberId={memberId}
            shouldCreateContract={true}
            onWipChange={setIsWip}
            onSubmitted={() => {
              if (showNotification) {
                showNotification({
                  header: 'Saved',
                  message: <>Quote saved</>,
                  type: 'olive',
                })
              }
              setIsWip(false)
            }}
          />
        </ActionsWrapper>
      )}
      <Headline>Quotes</Headline>
      {activeQuotes.map((quote) => (
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
