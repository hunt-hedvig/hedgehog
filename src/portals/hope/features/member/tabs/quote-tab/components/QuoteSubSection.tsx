import { Button, Card, CardsWrapper, MainHeadline, Modal } from '@hedvig-ui'
import {
  InsuranceType,
  TypeOfContract,
  TypeOfContractType,
} from 'portals/hope/features/config/constants'
import { useContracts } from 'portals/hope/features/member/tabs/contracts-tab/hooks/use-contracts'
import { CreateQuoteForm } from 'portals/hope/features/member/tabs/quote-tab/components/CreateQuoteForm'
import { isSignedOrExpired } from 'portals/hope/features/member/tabs/quote-tab/utils'
import React, { useState } from 'react'
import { Quote } from 'types/generated/graphql'
import { Muted } from '../common'
import { QuoteListItem } from './QuoteListItem'
import styled from '@emotion/styled'

const CreateQuoteWrapper = styled.div`
  padding: 0.8rem;
`

const CreateQuoteModal: React.FC<{
  onClose: () => void
  memberId: string
  insuranceType: InsuranceType
}> = ({ onClose, memberId, insuranceType }) => {
  return (
    <Modal onClose={onClose} title="Create quote" width="50rem">
      <CreateQuoteWrapper>
        <CreateQuoteForm
          memberId={memberId}
          insuranceType={insuranceType}
          onCancel={onClose}
          onSubmitted={onClose}
        />
      </CreateQuoteWrapper>
    </Modal>
  )
}

export const QuotesSubSection: React.FC<{
  memberId: string
  insuranceType: InsuranceType
  quotes: ReadonlyArray<Quote>
}> = ({ memberId, insuranceType, quotes }) => {
  const [isWip, setIsWip] = useState(false)
  const [contracts, { loading }] = useContracts(memberId)

  if (loading) {
    return null
  }

  const activeQuotes = quotes.filter((quote) => !isSignedOrExpired(quote))
  const signedOrExpiredQuotes = quotes.filter(isSignedOrExpired)

  const hasActiveContracts =
    contracts.filter(
      (contract) =>
        TypeOfContractType[contract.typeOfContract as TypeOfContract] ===
          insuranceType && !contract.terminationDate,
    ).length > 0

  return (
    <div>
      {!hasActiveContracts && (
        <Button style={{ marginBottom: 15 }} onClick={() => setIsWip(!isWip)}>
          Create
        </Button>
      )}
      {isWip && (
        <CreateQuoteModal
          insuranceType={insuranceType}
          memberId={memberId}
          onClose={() => {
            setIsWip(false)
          }}
        />
      )}
      {!!activeQuotes.length && (
        <>
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
        </>
      )}

      {!!signedOrExpiredQuotes.length && (
        <>
          <MainHeadline>Signed/Expired quotes</MainHeadline>
          <Muted>
            <CardsWrapper>
              {signedOrExpiredQuotes.map((quote) => (
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
        </>
      )}
    </div>
  )
}
