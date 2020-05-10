import { colorsV2 } from '@hedviginsurance/brand'
import {
  ApartmentQuoteData,
  NorwegianHomeContentQuoteData,
  NorwegianTravelLineOfBusiness,
  NorwegianTravelQuoteData,
  Quote,
  QuoteProductType,
} from 'api/generated/graphql'
import { Button } from 'hedvig-ui/button'
import { formatMoneySE } from 'lib/intl'
import * as React from 'react'
import styled from 'react-emotion'
import { connect } from 'react-redux'
import actions from 'store/actions'
import { isNorwegianTravel, isSwedishHouse } from 'utils/quote'
import { BottomSpacerWrapper, Muted } from './common'
import { QuoteActivation } from './quote-activation'
import { QuoteModification } from './quote-modification'

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
const BreachedUnderwritingGuidelines = styled('div')({
  color: colorsV2.coral700,
})

const ActionsButtonsWrapper = styled('div')({
  flexShrink: 1,
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

const getProductTypeValue = (quote: Quote): string => {
  if (quote.data?.__typename === 'ApartmentQuoteData') {
    return `${QuoteProductType.Apartment} (${
      (quote.data as ApartmentQuoteData)?.subType
    })`
  }
  if (isSwedishHouse(quote)) {
    return QuoteProductType.House
  }
  if (quote.data?.__typename === 'NorwegianHomeContentQuoteData') {
    return `${QuoteProductType.HomeContent} (${
      (quote.data as NorwegianHomeContentQuoteData)?.norwegianHomeContentSubType
    })`
  }
  if (quote.data?.__typename === 'NorwegianTravelQuoteData') {
    return `${QuoteProductType.Travel} ${
      (quote.data as NorwegianTravelQuoteData).subType ===
      NorwegianTravelLineOfBusiness.Youth
        ? '(YOUTH)'
        : ''
    }`
  }
  return ''
}

const QuoteDetails: React.FC<{
  quote: Quote
}> = ({ quote }) => (
  <DetailsWrapper>
    <AddressNPriceWrapper>
      {!isNorwegianTravel(quote) ? (
        <AddressWrapper>
          {quote.data?.street}
          {quote.data?.street && (
            <>
              , <br />
            </>
          )}
          {quote.data?.zipCode} {quote.data?.city ?? '🤷️'}
        </AddressWrapper>
      ) : (
        <br />
      )}
      <PriceWrapper>
        {quote.price && formatMoneySE({ amount: quote.price, currency: 'SEK' })}
        {!quote.price && '-'}
      </PriceWrapper>
    </AddressNPriceWrapper>
    <DetailWrapper>
      Product type: <strong>{getProductTypeValue(quote)}</strong>
      {!isNorwegianTravel(quote) ? (
        <>
          <br />
          Living space:
          <strong>
            {' '}
            {quote.data?.livingSpace} m<sup>2</sup>
          </strong>
          <br />
        </>
      ) : (
        <br />
      )}
      Household size:
      <strong> {quote.data?.householdSize} person(s)</strong>
    </DetailWrapper>

    {quote.breachedUnderwritingGuidelines?.length ||
      (0 > 0 && (
        <DetailWrapper>
          <BreachedUnderwritingGuidelines>
            <h3>Important! Member breaches underwriting guidelines</h3>
            <ul>
              {quote.breachedUnderwritingGuidelines!.map((guideline) => (
                <li key={guideline}>{guideline}</li>
              ))}
            </ul>
          </BreachedUnderwritingGuidelines>
        </DetailWrapper>
      ))}
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

export const QuoteListItemComponent: React.FC<{
  quote: Quote
  inactionable?: boolean
  memberId: string
  showNotification?: (data: any) => void
  insuranceRequest?: (memberId: string) => void
  insurancesListRequest?: (memberId: string) => void
}> = ({
  quote,
  inactionable,
  memberId,
  showNotification,
  insuranceRequest,
  insurancesListRequest,
}) => {
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
              <Button
                fullWidth
                variation="primary"
                onClick={toggleState(Action.MODIFY)}
              >
                Modify
              </Button>
            </BottomSpacerWrapper>
            <BottomSpacerWrapper>
              <Button
                fullWidth
                variation="success"
                onClick={toggleState(Action.ACTIVATE)}
              >
                Activate
              </Button>
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
              if (showNotification) {
                showNotification({
                  header: 'Activated',
                  message: 'Quote activated',
                  type: 'olive',
                })
              }
              setIsWip(false)
              setAction(null)
              if (insuranceRequest) {
                insuranceRequest(memberId)
              }
              if (insurancesListRequest) {
                insurancesListRequest(memberId)
              }
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
    </OuterWrapper>
  )
}

const mapActions = {
  ...actions.notificationsActions,
  ...actions.insuranceActions,
}

export const QuoteListItem = connect(null, mapActions)(QuoteListItemComponent)
