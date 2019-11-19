import { colorsV2 } from '@hedviginsurance/brand'
import { ApartmentQuoteData, Quote } from 'api/generated/graphql'
import { connect } from 'react-redux'
import actions from 'store/actions'
import { BottomSpacerWrapper, Muted } from './common'
import { QuoteActivation } from './quote-activation'
import { QuoteModification } from './quote-modification'
import { formatMoneySE } from 'lib/intl'
import * as React from 'react'
import { useState } from 'react'
import styled from 'react-emotion'
import { Button } from 'semantic-ui-react'

const OuterWrapper = styled('div')({
  ':not(:last-child)': {
    borderBottom: '1px solid ' + colorsV2.lightgray,
  },
})

const QuoteWrapper = styled('div')({
  display: 'flex',
  width: '100%',
  padding: '1rem 0',
  background: '#fff',
})
const DetailsWrapper = styled('div')({
  width: '100%',
})
const AddressNPriceWrapper = styled('div')({
  display: 'flex',
  paddingBottom: '1rem',
  lineHeight: 1.2,
})
const AddressWrapper = styled('div')({
  fontStyle: 'italic',
  color: colorsV2.midnight500,
  fontSize: '1.5rem',
  width: '50%',
})
const PriceWrapper = styled('div')({
  color: colorsV2.coral700,
  fontSize: '2rem',
})
const DetailWrapper = styled('div')({
  paddingBottom: '1rem',
})

const ActionsButtonsWrapper = styled('div')({
  flexShrink: 1,
})
const ActivateButton = styled(Button)({
  '&&': {
    whiteSpace: 'nowrap',
    width: '100%',
    background: colorsV2.grass500,
    color: '#fff',
    '&:hover, &:focus': {
      background: colorsV2.grass500,
      color: '#fff',
    },
  },
})
const ModifyButton = styled(Button)({
  '&&': {
    whiteSpace: 'nowrap',
    width: '100%',
    background: colorsV2.violet700,
    color: '#fff',
    '&:hover, &:focus': {
      background: colorsV2.violet700,
      color: '#fff',
    },
  },
})

const ActionsWrapper = styled('div')({
  background: colorsV2.flamingo200,
  padding: '1rem',
  width: '100%',
  marginBottom: '1rem',
})

enum Action {
  ACTIVATE,
  MODIFY,
}

const QuoteDetails: React.FunctionComponent<{
  quote: Quote
}> = function({ quote }) {
  return (
    <DetailsWrapper>
      <AddressNPriceWrapper>
        <AddressWrapper>
          {quote.data?.street}
          {quote.data?.street && (
            <>
              , <br />
            </>
          )}
          {quote.data?.zipCode} {quote.data?.city ?? '🤷️'}
        </AddressWrapper>
        <PriceWrapper>
          {quote.price &&
            formatMoneySE({ amount: quote.price, currency: 'SEK' })}
          {!quote.price && '-'}
        </PriceWrapper>
      </AddressNPriceWrapper>
      <DetailWrapper>
        Product type:{' '}
        <strong>
          {quote.productType}
          {quote.productType === 'APARTMENT' &&
            ` (${(quote.data as ApartmentQuoteData)?.subType ?? 'none'})`}
        </strong>
        <br />
        Living space:
        <strong>
          {' '}
          {quote.data?.livingSpace} m<sup>2</sup>
        </strong>
        <br />
        Household size:
        <strong> {quote.data?.householdSize} person(s)</strong>
      </DetailWrapper>
      <DetailWrapper>
        <Muted>
          Created: <strong>{quote.createdAt}</strong>
          <br />
          State: <strong>{quote.state}</strong>
          <br />
          Originating product id:{' '}
          <strong>{quote.originatingProductId ?? '-'}</strong>
          <br />
          Quote id: <strong>{quote.id}</strong>
        </Muted>
      </DetailWrapper>
    </DetailsWrapper>
  )
}

export const QuoteListItemComponent: React.FunctionComponent<{
  quote: Quote
  inactionable?: boolean
  memberId: string
  showNotification?: (data: any) => void
}> = function({ quote, inactionable, memberId, showNotification }) {
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

        {!!inactionable || (
          <ActionsButtonsWrapper>
            <BottomSpacerWrapper>
              <ModifyButton onClick={toggleState(Action.MODIFY)}>
                Modify
              </ModifyButton>
            </BottomSpacerWrapper>
            <BottomSpacerWrapper>
              <ActivateButton onClick={toggleState(Action.ACTIVATE)}>
                Activate
              </ActivateButton>
            </BottomSpacerWrapper>
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
              showNotification &&
                showNotification({
                  header: 'Activated',
                  message: (
                    <>
                      Quote activated,{' '}
                      <Button
                        color="green"
                        size="tiny"
                        onClick={() => window.location.reload()}
                      >
                        reload?
                      </Button>
                    </>
                  ),
                  type: 'olive',
                })
              setIsWip(false)
              setAction(null)
            }}
          />
        </ActionsWrapper>
      )}

      {action === Action.MODIFY && (
        <ActionsWrapper>
          <QuoteModification
            quote={quote}
            memberId={memberId}
            onWipChange={setIsWip}
            onSubmitted={() => {
              showNotification &&
                showNotification({
                  header: 'Saved',
                  message: <>Quote saved</>,
                  type: 'olive',
                })
              setIsWip(false)
              setAction(null)
            }}
          />
        </ActionsWrapper>
      )}
    </OuterWrapper>
  )
}

const mapActions = { ...actions.notificationsActions }

export const QuoteListItem = connect(null, mapActions)(QuoteListItemComponent)
