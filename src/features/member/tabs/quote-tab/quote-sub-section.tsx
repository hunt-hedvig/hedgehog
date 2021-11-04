import styled from '@emotion/styled'
import { Button, Card, CardsWrapper, MainHeadline } from '@hedvig-ui'
import {
  ContractType,
  Market,
  TypeOfContractType,
} from 'features/config/constants'
import { useContracts } from 'features/member/tabs/contracts-tab/hooks/use-contracts'
import { CreateQuoteForm } from 'features/member/tabs/quote-tab/create-quote-form'
import { isSignedOrExpired } from 'features/member/tabs/quote-tab/utils'
import React from 'react'
import { Quote } from 'types/generated/graphql'
import { ActionsWrapper, Muted } from './common'
import { QuoteListItem } from './quote-list-item'

const Wrapper = styled('div')({})

export const QuotesSubSection: React.FC<{
  memberId: string
  contractType: ContractType
  quotes: ReadonlyArray<Quote>
  market: Market
}> = ({ memberId, contractType, quotes, market }) => {
  const [isWip, setIsWip] = React.useState(false)
  const activeQuotes = quotes.filter((quote) => !isSignedOrExpired(quote))
  const [contracts, { loading }] = useContracts(memberId)

  if (loading) {
    return null
  }

  const hasActiveContracts =
    contracts.filter(
      (contract) =>
        TypeOfContractType[contract.typeOfContract] === contractType &&
        !contract.terminationDate,
    ).length > 0

  return (
    <Wrapper>
      {!hasActiveContracts && (
        <Button style={{ marginBottom: 15 }} onClick={() => setIsWip(!isWip)}>
          Create
        </Button>
      )}
      {isWip && (
        <ActionsWrapper>
          <CreateQuoteForm
            memberId={memberId}
            contractType={contractType}
            onSubmitted={() => {
              setIsWip(false)
            }}
          />
        </ActionsWrapper>
      )}
      <MainHeadline>Quotes</MainHeadline>
      <CardsWrapper>
        {activeQuotes.map((quote) => (
          <Card key={quote.id}>
            <QuoteListItem
              quote={quote}
              memberId={memberId}
              market={market}
              contracts={contracts}
            />
          </Card>
        ))}
      </CardsWrapper>

      <MainHeadline>Signed/Expired quotes</MainHeadline>
      <Muted>
        <CardsWrapper>
          {quotes.filter(isSignedOrExpired).map((quote) => (
            <Card key={quote.id}>
              <QuoteListItem
                quote={quote}
                memberId={memberId}
                contracts={contracts}
                inactionable
              />
            </Card>
          ))}
        </CardsWrapper>
      </Muted>
    </Wrapper>
  )
}
