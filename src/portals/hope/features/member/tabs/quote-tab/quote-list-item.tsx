import styled from '@emotion/styled'
import { Button, ErrorText, Label } from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import chroma from 'chroma-js'
import { format, parseISO } from 'date-fns'
import { UpdateQuoteForm } from 'portals/hope/features/member/tabs/quote-tab/update-quote-form'
import { getSchemaDataInfo } from 'portals/hope/features/member/tabs/quote-tab/utils'
import React, { useState } from 'react'
import { Contract, Quote } from 'types/generated/graphql'
import { ActionsWrapper, BottomSpacerWrapper } from './common'
import { QuoteActivation } from './quote-activation'
import { QuoteContractCreation } from './quote-contract-creation'
import { QuotePrice } from './QuotePrice'

const OuterWrapper = styled.div`
  width: 100%;
`

const QuoteWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 0.5rem;
`

const DetailsWrapper = styled.div`
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

  .quote-state {
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

const QuoteDetails: React.FC<{
  quote: Quote
}> = ({ quote }) => (
  <DetailsWrapper>
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
      <div className="quote-state">
        <Label>State</Label>
        <div>{quote.state ? convertEnumToTitle(quote.state) : '-'}</div>
      </div>
    </DataWrapper>
    <DataWrapper>
      {getSchemaDataInfo({ schemaData: quote.schemaData })}
    </DataWrapper>
  </DetailsWrapper>
)

export const QuoteListItem: React.FC<{
  contracts: ReadonlyArray<Contract>
  quote: Quote
  inactionable?: boolean
  memberId: string
}> = ({ contracts, quote, inactionable, memberId }) => {
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
      <QuoteWrapper>
        <QuoteDetails quote={quote} />
        <ActionsButtonsWrapper>
          {!!inactionable || (
            <>
              {!quote.isReadyToSign ? (
                <BottomSpacerWrapper>
                  <Button
                    style={{ width: '100%' }}
                    onClick={toggleState(Action.ACTIVATE)}
                  >
                    Activate
                  </Button>
                </BottomSpacerWrapper>
              ) : contracts.length || quote.allowOverrideSignFromHope ? (
                <BottomSpacerWrapper>
                  <Button
                    style={{ width: '100%' }}
                    onClick={toggleState(Action.SIGN)}
                  >
                    Sign
                  </Button>
                </BottomSpacerWrapper>
              ) : (
                <ErrorText>Member has to sign first contract</ErrorText>
              )}
              <BottomSpacerWrapper>
                <Button
                  style={{ width: '100%' }}
                  variant="secondary"
                  onClick={toggleState(Action.MODIFY)}
                >
                  Modify
                </Button>
              </BottomSpacerWrapper>
            </>
          )}
          <Button
            style={{ width: '100%' }}
            variant="tertiary"
            onClick={() =>
              alert(
                `# Quote ID #\r\n${quote.id}\r\n\r\n# Originating Product ID #\r\n${quote.originatingProductId}`,
              )
            }
          >
            Debug info
          </Button>
        </ActionsButtonsWrapper>
      </QuoteWrapper>
      {action === Action.ACTIVATE && (
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
      )}

      {action === Action.SIGN && (
        <ActionsWrapper>
          <QuoteContractCreation
            quote={quote}
            memberId={memberId}
            onWipChange={setIsWip}
          />
        </ActionsWrapper>
      )}

      {action === Action.MODIFY && (
        <ActionsWrapper>
          <UpdateQuoteForm
            quote={quote}
            onSubmitted={() => {
              setIsWip(false)
              setAction(null)
            }}
          />
        </ActionsWrapper>
      )}
    </OuterWrapper>
  )
}
