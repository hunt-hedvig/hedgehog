import styled from '@emotion/styled'
import { Quote } from 'api/generated/graphql'
import { CreateQuoteForm } from 'components/member/tabs/quote-tab/create-quote-form'
import { Button } from 'hedvig-ui/button'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { MainHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { showNotification } from 'store/actions/notificationsActions'
import { ContractType } from 'types/enums'
import { isSignedOrExpired } from 'utils/quote'
import { ActionsWrapper, Muted } from './common'
import { QuoteListItem } from './quote-list-item'

const Wrapper = styled('div')({})

export const QuotesSubSection: React.FC<{
  memberId: string
  contractType: ContractType
  quotes: ReadonlyArray<Quote>
}> = ({ memberId, contractType, quotes }) => {
  const [isWip, setIsWip] = React.useState(false)
  const activeQuotes = quotes.filter((quote) => !isSignedOrExpired(quote))

  return (
    <Wrapper>
      {<Button onClick={() => setIsWip(!isWip)}>Create</Button>}
      {isWip && (
        <ActionsWrapper>
          <CreateQuoteForm
            memberId={memberId}
            contractType={contractType}
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
      <MainHeadline>Quotes</MainHeadline>
      <CardsWrapper>
        {activeQuotes.map((quote) => (
          <Card key={quote.id}>
            <QuoteListItem quote={quote} memberId={memberId} />
          </Card>
        ))}
      </CardsWrapper>

      <MainHeadline>Signed/Expired quotes</MainHeadline>
      <Muted>
        <CardsWrapper>
          {quotes.filter(isSignedOrExpired).map((quote) => (
            <Card key={quote.id}>
              <QuoteListItem quote={quote} memberId={memberId} inactionable />
            </Card>
          ))}
        </CardsWrapper>
      </Muted>
    </Wrapper>
  )
}
