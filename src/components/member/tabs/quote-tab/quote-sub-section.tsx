import * as React from 'react'
import { Quote } from '../../../../api/generated/graphql'
import { Action } from 'redux'
import { Button } from '../../../../../shared/hedvig-ui/button'
import { ActionsWrapper, QuoteListItem } from './quote-list-item'
import { QuoteModification } from './quote-modification'
import { showNotification } from '../../../../store/actions/notificationsActions'
import { signedOrExpiredPredicate } from '../../../../graphql/use-quotes'
import { Muted } from './common'
import styled from 'react-emotion'

export const QuotesSubSection: React.FunctionComponent<{
  memberId: string
  quotes: ReadonlyArray<Quote>
}> = ({ memberId, quotes }) => {
  const Headline = styled('h1')({})
  const Wrapper = styled('div')({
    padding: '1rem',
  })
  const [isWip, setIsWip] = React.useState(false)
  const [action, setAction] = React.useState<Action | null>(null)

  return (
    <Wrapper>
      {quotes.length === 0 && (
        <Button onClick={() => setIsWip(!isWip)}>Create</Button>
      )}
      {quotes.length === 0 && isWip && (
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
              setAction(null)
            }}
          />
        </ActionsWrapper>
      )}
      <Headline>Quotes</Headline>
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
