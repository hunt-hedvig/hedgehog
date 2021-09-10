import styled from '@emotion/styled'
import { Button, Card, CardsWrapper, MainHeadline } from '@hedvig-ui'
import { Quote } from 'api/generated/graphql'
import { CreateQuoteForm } from 'features/member/tabs/quote-tab/create-quote-form'
import { useContracts } from 'graphql/use-contracts'
import React from 'react'
import { ContractType, TypeOfContractType } from 'types/enums'
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
        <Button onClick={() => setIsWip(!isWip)}>Create</Button>
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
