import {
  Button,
  Card,
  CardsWrapper,
  Flex,
  MainHeadline,
  Modal,
  StandaloneMessage,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import {
  InsuranceType,
  TypeOfContract,
  TypeOfContractType,
} from 'portals/hope/features/config/constants'
import { useContracts } from 'portals/hope/features/member/tabs/contracts-tab/hooks/use-contracts'
import { CreateQuoteForm } from 'portals/hope/features/member/tabs/quote-tab/components/CreateQuoteForm'
import {
  isExpired,
  isSigned,
  isSignedOrExpired,
} from 'portals/hope/features/member/tabs/quote-tab/utils'
import React, { useState } from 'react'
import { Quote } from 'types/generated/graphql'
import { Muted } from '../common'
import { QuoteListItem } from './QuoteListItem'
import styled from '@emotion/styled'
import chroma from 'chroma-js'

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

const MutedInfo = styled.div<{ visible?: boolean }>`
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  margin-top: 0.25rem;
  color: ${({ theme }) => chroma(theme.semiStrongForeground).alpha(0.8).hex()};
  font-size: 0.75rem;
  text-align: center;
  max-width: 10rem;
`

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

  const signedQuotes = quotes.filter(isSigned)
  const expiredQuotes = quotes.filter(isExpired)

  const hasActiveContracts =
    contracts.filter(
      (contract) =>
        TypeOfContractType[contract.typeOfContract as TypeOfContract] ===
          insuranceType && !contract.terminationDate,
    ).length > 0

  return (
    <div style={{ paddingBottom: '7rem' }}>
      <Flex justify="space-between">
        <MainHeadline>Quotes</MainHeadline>
        <div>
          <Button
            variant="primary"
            disabled={hasActiveContracts}
            style={{ width: '10rem' }}
            onClick={() => setIsWip(!isWip)}
          >
            Create quote
          </Button>

          <MutedInfo visible={hasActiveContracts}>
            There's an active contract
          </MutedInfo>
        </div>
      </Flex>
      {isWip && (
        <CreateQuoteModal
          insuranceType={insuranceType}
          memberId={memberId}
          onClose={() => {
            setIsWip(false)
          }}
        />
      )}
      {!activeQuotes.length ? (
        <StandaloneMessage
          paddingTop="7rem"
          paddingBottom="5rem"
          style={{ textAlign: 'center', fontSize: '1.4rem' }}
        >
          <div>No pending quotes</div>
        </StandaloneMessage>
      ) : (
        <>
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

      <ThirdLevelHeadline style={{ marginTop: '4rem' }}>
        Signed
      </ThirdLevelHeadline>
      {!signedQuotes.length ? (
        <StandaloneMessage
          paddingTop="7rem"
          paddingBottom="5rem"
          style={{ textAlign: 'center', fontSize: '1.4rem' }}
        >
          <div>No signed quotes</div>
        </StandaloneMessage>
      ) : (
        <>
          <Muted>
            <CardsWrapper>
              {signedQuotes.map((quote) => (
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

      <ThirdLevelHeadline style={{ marginTop: '4rem' }}>
        Expired
      </ThirdLevelHeadline>
      {!expiredQuotes.length ? (
        <StandaloneMessage
          paddingTop="7rem"
          paddingBottom="5rem"
          style={{ textAlign: 'center', fontSize: '1.4rem' }}
        >
          <div>No expired quotes</div>
        </StandaloneMessage>
      ) : (
        <>
          <Muted>
            <CardsWrapper>
              {expiredQuotes.map((quote) => (
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
