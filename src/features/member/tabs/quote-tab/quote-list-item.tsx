import styled from '@emotion/styled'
import { Button, ErrorText, ThirdLevelHeadline } from '@hedvig-ui'
import { format, parseISO } from 'date-fns'
import { UpdateQuoteForm } from 'features/member/tabs/quote-tab/update-quote-form'
import React from 'react'
import { Contract, Quote } from 'types/generated/graphql'
import { getSchemaDataInfo } from 'utils/quote'
import { convertEnumToTitle } from 'utils/text'
import { ActionsWrapper, BottomSpacerWrapper, Muted } from './common'
import { QuoteActivation } from './quote-activation'
import { QuoteContractCreation } from './quote-contract-creation'
import { QuotePrice } from './QuotePrice'

const OuterWrapper = styled('div')(({}) => ({
  width: '100%',
}))

const QuoteWrapper = styled('div')(() => ({
  display: 'flex',
  width: '100%',
  padding: '1rem 0',
}))
const DetailsWrapper = styled('div')({
  width: '100%',
})
const DetailWrapper = styled('div')(({ theme }) => ({
  color: theme.semiStrongForeground,
  paddingBottom: '1rem',
}))

const BreachedUnderwritingGuidelines = styled('div')(({ theme }) => ({
  color: theme.danger,
}))

const ActionsButtonsWrapper = styled('div')({
  flexShrink: 1,
})

enum Action {
  ACTIVATE,
  MODIFY,
  SIGN,
}

const QuoteDetails: React.FC<{
  quote: Quote
}> = ({ quote }) => (
  <DetailsWrapper>
    <QuotePrice quote={quote} />
    {(quote.breachedUnderwritingGuidelines?.length || 0) > 0 && (
      <DetailWrapper>
        <BreachedUnderwritingGuidelines>
          <ThirdLevelHeadline>
            Quote breaches the following underwriting guidelines:
          </ThirdLevelHeadline>
          <ul>
            {quote.breachedUnderwritingGuidelines!.map((guideline) => (
              <li key={guideline}>{convertEnumToTitle(guideline)}</li>
            ))}
          </ul>
        </BreachedUnderwritingGuidelines>
      </DetailWrapper>
    )}
    <DetailWrapper>
      <Muted>
        Created:{' '}
        <strong>{format(parseISO(quote.createdAt), 'yyyy-MM-dd hh:mm')}</strong>
        <br />
        State:{' '}
        <strong>{quote.state ? convertEnumToTitle(quote.state) : '-'}</strong>
        <br />
        Originating Product Id:{' '}
        <strong>{quote.originatingProductId ?? '-'}</strong>
        <br />
        Quote id: <strong>{quote.id}</strong>
      </Muted>
    </DetailWrapper>
    <DetailWrapper>
      {getSchemaDataInfo({ schemaData: quote.schemaData })}
    </DetailWrapper>
  </DetailsWrapper>
)

export const QuoteListItem: React.FC<{
  contracts: ReadonlyArray<Contract>
  quote: Quote
  inactionable?: boolean
  memberId: string
}> = ({ contracts, quote, inactionable, memberId }) => {
  const [action, setAction] = React.useState<Action | null>(null)
  const [isWip, setIsWip] = React.useState(false)

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
        {!!inactionable || (
          <ActionsButtonsWrapper>
            <BottomSpacerWrapper>
              <Button onClick={toggleState(Action.MODIFY)}>Modify</Button>
            </BottomSpacerWrapper>
            {!quote.isReadyToSign && (
              <BottomSpacerWrapper>
                <Button onClick={toggleState(Action.ACTIVATE)}>Activate</Button>
              </BottomSpacerWrapper>
            )}
            {quote.isReadyToSign && contracts.length > 0 && (
              <BottomSpacerWrapper>
                <Button onClick={toggleState(Action.SIGN)}>Sign</Button>
              </BottomSpacerWrapper>
            )}
            {quote.isReadyToSign && contracts.length === 0 && (
              <ErrorText>Member has to sign first contract</ErrorText>
            )}
          </ActionsButtonsWrapper>
        )}
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
