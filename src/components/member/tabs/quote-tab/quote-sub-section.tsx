import { Quote } from 'api/generated/graphql'
import { CreateQuoteForm } from 'components/member/tabs/quote-tab/create-quote-form'
import { signedOrExpiredPredicate, signedPredicate } from 'graphql/use-quotes'
import { Button } from 'hedvig-ui/button'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import React from 'react'
import styled from 'react-emotion'
import { showNotification } from 'store/actions/notificationsActions'
import { ActionsWrapper, Muted } from './common'
import { QuoteListItem } from './quote-list-item'

const Headline = styled('h1')({})
const Wrapper = styled('div')({})

export const QuotesSubSection: React.FunctionComponent<{
  memberId: string
  contractType: string
  quotes: ReadonlyArray<Quote>
}> = ({ memberId, contractType, quotes }) => {
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
          <CreateQuoteForm
            memberId={memberId}
            contractToCreate={contractType}
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
      <CardsWrapper>
        {activeQuotes.map((quote) => (
          <Card key={quote.id}>
            <QuoteListItem quote={quote} memberId={memberId} />
          </Card>
        ))}
      </CardsWrapper>

      <Headline>Signed/Expired quotes</Headline>
      <Muted>
        <CardsWrapper>
          {quotes.filter(signedOrExpiredPredicate).map((quote) => (
            <Card key={quote.id}>
              <QuoteListItem quote={quote} memberId={memberId} inactionable />
            </Card>
          ))}
        </CardsWrapper>
      </Muted>
    </Wrapper>
  )
}
