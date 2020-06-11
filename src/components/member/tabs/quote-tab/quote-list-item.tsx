import { Quote, QuoteProductType } from 'api/generated/graphql'
import { Button } from 'hedvig-ui/button'
import React from 'react'
import styled from 'react-emotion'
import { connect } from 'react-redux'
import actions from 'store/actions'
import { formatMoney } from 'utils/money'
import {
  getSubType,
  isNorwegianHomeContent,
  isNorwegianTravel,
  isSwedishApartment,
  isSwedishHouse,
} from 'utils/quote'
import { ActionsWrapper, BottomSpacerWrapper, Muted } from './common'
import { QuoteActivation } from './quote-activation'
import { QuoteContractCreation } from './quote-contract-creation'
import { QuoteModification } from './quote-modification'

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
const AddressNPriceWrapper = styled('div')({
  display: 'flex',
  paddingBottom: '1rem',
  lineHeight: 1.2,
})
const AddressWrapper = styled('div')(({}) => ({
  fontStyle: 'italic',
  fontSize: '1.5rem',
  width: '50%',
}))
const PriceWrapper = styled('div')({
  fontSize: '2rem',
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

const getProductTypeValue = (quote: Quote): string => {
  if (quote.data?.__typename === 'ApartmentQuoteData') {
    return `${QuoteProductType.Apartment} (${getSubType(quote.data)})`
  }
  if (isSwedishHouse(quote?.data)) {
    return QuoteProductType.House
  }
  if (isNorwegianHomeContent(quote?.data)) {
    return `${QuoteProductType.HomeContent} (${getSubType(quote.data)})`
  }
  if (isNorwegianTravel(quote?.data)) {
    return `${QuoteProductType.Travel} ${getSubType(quote.data)}`
  }
  return ''
}

const QuoteDetails: React.FC<{
  quote: Quote
}> = ({ quote }) => (
  <DetailsWrapper>
    <AddressNPriceWrapper>
      {isSwedishHouse(quote?.data) ||
      isSwedishApartment(quote?.data) ||
      isNorwegianHomeContent(quote?.data) ? (
        <AddressWrapper>
          {quote.data.street}
          {quote.data.street && (
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
        {quote.price && formatMoney({ amount: quote.price, currency: 'SEK' })}
        {!quote.price && '-'}
      </PriceWrapper>
    </AddressNPriceWrapper>
    <DetailWrapper>
      Product type: <strong>{getProductTypeValue(quote)}</strong>
      {!isNorwegianTravel(quote?.data) ? (
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
            {!quote.isReadyToSign && (
              <BottomSpacerWrapper>
                <Button
                  fullWidth
                  variation="success"
                  onClick={toggleState(Action.ACTIVATE)}
                >
                  Activate
                </Button>
              </BottomSpacerWrapper>
            )}
            {quote.isReadyToSign && (
              <BottomSpacerWrapper>
                <Button
                  fullWidth
                  variation="success"
                  onClick={toggleState(Action.SIGN)}
                >
                  Sign
                </Button>
              </BottomSpacerWrapper>
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

      {action === Action.SIGN && (
        <ActionsWrapper>
          <QuoteContractCreation
            quote={quote}
            memberId={memberId}
            onWipChange={setIsWip}
            onSubmitted={() => {
              if (showNotification) {
                showNotification({
                  header: 'Contract Created',
                  message: 'Contract created successfully!!',
                  type: 'olive',
                })
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
            shouldCreateContract={false}
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
