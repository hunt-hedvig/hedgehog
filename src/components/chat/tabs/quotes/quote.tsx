import { colorsV2 } from '@hedviginsurance/brand'
import { ApartmentQuoteData, QuoteData, QuoteResponseEntity } from 'components/chat/tabs/quotes/data'
import { BaseDatePicker } from 'components/shared/inputs/DatePicker'
import { formatMoneySE } from 'lib/intl'
import { DatePicker } from 'material-ui-pickers'
import * as React from 'react'
import { useState } from 'react'
import styled from 'react-emotion'
import { Button, Checkbox, Label } from 'semantic-ui-react'

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
const BottomSpacerWrapper = styled('div')({
  paddingBottom: '1rem',
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
    }
  }
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
    }
  }
})
const OtherButton = styled(Button)({
  '&&': {
    whiteSpace: 'nowrap',
    width: '100%',
    background: colorsV2.darkgray,
    color: '#fff',
    '&:hover, &:focus': {
      background: colorsV2.darkgray,
      color: '#fff',
    }
  }
})

const ActionsWrapper = styled('div')({
  background: colorsV2.flamingo200,
  padding: '1rem',
  width: '100%'
})
const SubmitButton = styled(Button)({
  '&&': {
    whiteSpace: 'nowrap',
    width: '100%',
    background: colorsV2.ocean700,
    color: '#fff',
    '&:hover, &:focus': {
      background: colorsV2.grass500,
      color: '#fff',
    }
  }
})

enum Action {
  ACTIVATE,
  MODIFY
}

export const Quote: React.FunctionComponent<{ quote: QuoteResponseEntity<QuoteData> }> =
  function ({ quote }) {
    const [action, setAction] = useState<Action | null>(null)
    const [activationDate, setActivationDate] = useState<Date | null>(null)
    const [terminationDate, setTerminationDate] = useState<Date | null>(null)
    const [useGap, setUseGap] = useState(false)

    return (
      <OuterWrapper>
        <QuoteWrapper>
          <DetailsWrapper>
            <AddressNPriceWrapper>
              <AddressWrapper>
                {quote.data.street}{quote.data.street && <>, <br /></>}
                {quote.data.zipCode} {quote.data.city ?? '🤷️'}
              </AddressWrapper>
              <PriceWrapper>
                {quote.price && formatMoneySE({ amount: quote.price, currency: 'SEK' })}
                {!quote.price && '-'}
              </PriceWrapper>
            </AddressNPriceWrapper>
            <DetailWrapper>
              Product type:{' '}
              <strong>
                {quote.productType}
                {quote.productType === 'APARTMENT' && ` (${(quote.data as ApartmentQuoteData)?.subType ?? 'none'})`}
              </strong>
              <br />

              Living space:
              <strong> {quote.data.livingSpace} m<sup>2</sup></strong><br />

              Household size:
              <strong> {quote.data.householdSize} person(s)</strong>
            </DetailWrapper>
            <DetailWrapper>
              Modified: <strong>{quote.createdAt}</strong><br />
              State: <strong>{quote.state}</strong>
            </DetailWrapper>
          </DetailsWrapper>
          <ActionsButtonsWrapper>
            <BottomSpacerWrapper>
              <ActivateButton onClick={() => {
                if (action === Action.ACTIVATE) {
                  setAction(null)
                } else {
                  setAction(Action.ACTIVATE)
                }
              }}>Activate</ActivateButton>
            </BottomSpacerWrapper>
            <BottomSpacerWrapper>
              <ModifyButton>Modify</ModifyButton>
            </BottomSpacerWrapper>
            <div>
              <OtherButton>Do something?</OtherButton>
            </div>
          </ActionsButtonsWrapper>
        </QuoteWrapper>
        {action !== null && (
          <ActionsWrapper>
            {action === Action.ACTIVATE && (
              <form onSubmit={(e) => {
                e.preventDefault()
                // TODO
                // activateQuote({ variables: { memberId }})
              }}>
                <BottomSpacerWrapper>
                  <div>
                    <strong>Activation date</strong>
                  </div>
                  <div>
                    <BaseDatePicker value={activationDate} onChange={setActivationDate} />
                  </div>
                </BottomSpacerWrapper>

                <BottomSpacerWrapper>
                  <Checkbox
                    onChange={(e) => {
                      const newUseGap = !useGap
                      if (!newUseGap) {
                        setTerminationDate(null)
                      }
                      setUseGap(newUseGap)
                    }}
                    label="Create gap between insurances"
                    value={useGap}
                  />
                </BottomSpacerWrapper>

                {useGap && (
                  <BottomSpacerWrapper>
                    <div>
                      <strong>Terminate current insurance at</strong>
                    </div>
                    <div>
                      <BaseDatePicker
                        value={terminationDate}
                        onChange={setTerminationDate}
                        minDate={activationDate}
                      />
                    </div>
                  </BottomSpacerWrapper>
                )}

                <SubmitButton type="submit">
                  Do activate quote
                </SubmitButton>
              </form>
            )}
          </ActionsWrapper>
        )}
      </OuterWrapper>
    )
  }
