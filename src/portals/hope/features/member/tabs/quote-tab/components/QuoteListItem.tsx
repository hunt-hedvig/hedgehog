import styled from '@emotion/styled'
import { Button, ErrorText, Flex, Label, Modal } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import chroma from 'chroma-js'
import { format, parseISO } from 'date-fns'
import { UpdateQuoteForm } from 'portals/hope/features/member/tabs/quote-tab/components/UpdateQuoteForm'
import { SchemaDataSummary } from 'portals/hope/features/member/tabs/quote-tab/utils'
import React, { useState } from 'react'
import { Contract, Quote } from 'types/generated/graphql'
import { QuoteActivation } from './QuoteActivation'
import { QuoteContractCreation } from './QuoteContractCreation'
import { QuotePrice } from './QuotePrice'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'

const ActionsWrapper = styled.div`
  background-color: ${({ theme }) =>
    chroma(theme.accent).alpha(0.1).brighten(1).hex()};

  border-radius: 0.5rem;

  display: flex;
  flex-wrap: wrap;

  background-color: ${({ theme }) =>
    chroma(theme.accent).alpha(0.1).brighten(1).hex()};

  padding: 0.25rem 0.7rem;

  margin: 0 1rem 1rem 0;

  > div {
    width: 100%;
    padding: 0.5rem;
  }
`

const OuterWrapper = styled.div`
  width: 100%;
`

const BreachedUnderwritingGuidelines = styled.div`
  color: ${({ theme }) => theme.danger};
  display: flex;
  flex-wrap: wrap;

  background-color: ${({ theme }) =>
    chroma(theme.accent).alpha(0.1).brighten(1).hex()};

  padding: 0.5rem 0.7rem;
  margin: 0 1rem 1rem 0;
  border-radius: 0.5rem;

  label:first-of-type {
    margin: 0.5rem;
    margin-bottom: 0;
    width: 100%;
  }

  > div {
    margin: 0.5rem;
  }
`

const BreachedGuidelineTag = styled.div`
  color: ${({ theme }) => theme.accentContrast};
  background-color: ${({ theme }) => theme.danger};
  padding: 0.25rem 0.45rem;
  border-radius: 0.5rem;
  font-size: 1rem;
`

const ActionsButtonsWrapper = styled.div`
  flex-shrink: 1;
`

const DataWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;

  background-color: ${({ theme }) =>
    chroma(theme.accent).alpha(0.1).brighten(1).hex()};

  padding: 0.25rem 0.7rem;

  margin: 0 1rem 1rem 0;

  border-radius: 0.5rem;

  > div {
    width: 100%;
    padding: 0.5rem;
  }

  .created-at {
    width: 40%;
  }

  .next-to-created-at {
    width: 60%;
  }

  .street {
    width: 40%;
  }

  .zipCode {
    width: 30%;
  }

  .city {
    width: 30%;
  }

  .numberCoInsured {
    width: 40%;
  }

  .isStudent {
    width: 30%;
  }
`

enum Action {
  ACTIVATE,
  MODIFY,
  SIGN,
}

const QuoteGeneralInfo: React.FC<{
  quote: Quote
}> = ({ quote }) => (
  <div style={{ width: '100%' }}>
    {quote.price && (
      <DataWrapper>
        <QuotePrice quote={quote} />
      </DataWrapper>
    )}
    {(quote.breachedUnderwritingGuidelines?.length || 0) > 0 && (
      <div>
        <BreachedUnderwritingGuidelines>
          <Label>Breached underwriting guidelines</Label>
          {quote.breachedUnderwritingGuidelines?.map((guideline) => (
            <BreachedGuidelineTag key={guideline}>
              {convertEnumToTitle(guideline)}
            </BreachedGuidelineTag>
          )) ?? []}
        </BreachedUnderwritingGuidelines>
      </div>
    )}
    <DataWrapper>
      <div className="created-at">
        <Label>Created</Label>
        <div>{format(parseISO(quote.createdAt), 'yyyy-MM-dd HH:mm')}</div>
      </div>
      {quote.signedAt && (
        <div className="next-to-created-at">
          <Label>Signed at</Label>
          <div>{format(parseISO(quote.signedAt), 'yyyy-MM-dd HH:mm')}</div>
        </div>
      )}
      <div className={quote.signedAt ? '' : 'next-to-created-at'}>
        <Label>State</Label>
        <div>{quote.state ? convertEnumToTitle(quote.state) : '-'}</div>
      </div>
    </DataWrapper>
  </div>
)

export const QuoteListItem: React.FC<{
  contracts: ReadonlyArray<Contract>
  quote: Quote
  inactionable?: boolean
  memberId: string
}> = ({ contracts, quote, inactionable, memberId }) => {
  const { confirm } = useConfirmDialog()
  const [showDebug, setShowDebug] = useState(false)
  const [action, setAction] = useState<Action | null>(null)
  const [isWip, setIsWip] = useState(false)

  const toggleState = (targetAction: Action) => () => {
    const isTransitionToOpen = action === null
    if (isTransitionToOpen) {
      setAction(targetAction)
      return
    }

    const isTransitionToClose = action === targetAction
    if (isTransitionToClose) {
      if (
        !isWip ||
        confirm('Any changes will get lost. Do you want to continue?')
      ) {
        setAction(null)
      }
      return
    }

    const isTransitionToOther = true
    if (isTransitionToOther) {
      if (
        !isWip ||
        confirm('Any changes will get lost. Do you want to continue?')
      ) {
        setAction(targetAction)
        return
      }
    }

    throw Error(
      'Illegal state! This should never happen, please file a report to the ministry of logic',
    )
  }

  return (
    <OuterWrapper>
      <Flex fullWidth>
        <div style={{ width: '100%' }}>
          <QuoteGeneralInfo quote={quote} />
          {action === Action.ACTIVATE ? (
            <ActionsWrapper>
              <QuoteActivation
                quote={quote}
                memberId={memberId}
                onWipChange={setIsWip}
                onSubmitted={() => {
                  setIsWip(false)
                  setAction(null)
                }}
              />
            </ActionsWrapper>
          ) : action === Action.SIGN ? (
            <ActionsWrapper>
              <QuoteContractCreation
                quote={quote}
                memberId={memberId}
                onWipChange={setIsWip}
              />
            </ActionsWrapper>
          ) : action === Action.MODIFY ? (
            <ActionsWrapper>
              <UpdateQuoteForm
                quote={quote}
                onCancel={() => {
                  confirm('Do you really want to cancel modifying?').then(
                    () => {
                      setIsWip(false)
                      setAction(null)
                    },
                  )
                }}
                onSubmitted={() => {
                  setIsWip(false)
                  setAction(null)
                }}
              />
            </ActionsWrapper>
          ) : (
            <DataWrapper>
              {SchemaDataSummary({ schemaData: quote.schemaData })}
            </DataWrapper>
          )}
        </div>
        <ActionsButtonsWrapper>
          {!!inactionable || (
            <>
              {!quote.isReadyToSign ? (
                <div style={{ paddingBottom: '1rem' }}>
                  <Button
                    style={{ width: '100%' }}
                    onClick={toggleState(Action.ACTIVATE)}
                  >
                    Activate
                  </Button>
                </div>
              ) : contracts.length || quote.allowOverrideSignFromHope ? (
                <div style={{ paddingBottom: '1rem' }}>
                  <Button
                    style={{ width: '100%' }}
                    onClick={toggleState(Action.SIGN)}
                  >
                    Sign
                  </Button>
                </div>
              ) : (
                <ErrorText>Member has to sign first contract</ErrorText>
              )}
              <div style={{ paddingBottom: '1rem' }}>
                <Button
                  style={{ width: '100%' }}
                  variant="secondary"
                  onClick={toggleState(Action.MODIFY)}
                >
                  Modify
                </Button>
              </div>
            </>
          )}
          <Button
            style={{ width: '100%' }}
            variant="tertiary"
            onClick={() => setShowDebug(true)}
          >
            Debug info
          </Button>
          {showDebug && (
            <Modal
              onClose={() => setShowDebug(false)}
              style={{ padding: '1rem' }}
            >
              Quote ID: {quote.id} <br />
              Originating Product ID: {quote.originatingProductId} <br />
            </Modal>
          )}
        </ActionsButtonsWrapper>
      </Flex>
    </OuterWrapper>
  )
}
