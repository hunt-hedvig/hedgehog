import { Contract, Quote } from 'api/generated/graphql'
import { BaseDatePicker } from 'components/shared/inputs/DatePicker'
import {
  addAgreementFromQuoteOptions,
  useAddAgreementFromQuote,
} from 'graphql/use-add-agreement-from-quote'
import { useContracts } from 'graphql/use-contracts'
import { Button } from 'hedvig-ui/button'
import * as React from 'react'
import { Checkbox } from 'semantic-ui-react'
import { noopFunction } from 'utils'
import { BottomSpacerWrapper, ErrorMessage } from './common'

const getContract = (contracts, quote): Contract => {
  return contracts.find((contract) =>
    contract.agreements.some(
      (agreement) => agreement.id === quote.originatingProductId,
    ),
  )
}

export const QuoteActivation: React.FC<{
  quote: Quote
  memberId
  onSubmitted?: () => void
  onWipChange?: (isWip: boolean) => void
}> = ({
  quote,
  memberId,
  onSubmitted = noopFunction,
  onWipChange = noopFunction,
}) => {
  const [useGap, setUseGap] = React.useState(false)
  const [contracts] = useContracts(memberId)
  const contract = getContract(contracts, quote)
  const [activeFrom, setActiveFrom] = React.useState<Date>(new Date())
  const [
    previousAgreementActiveTo,
    setPreviousAgreementActiveTo,
  ] = React.useState<Date | null>(null)

  const [addAgreement, addAgreementMutation] = useAddAgreementFromQuote()

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        if (
          addAgreementMutation.loading ||
          !activeFrom ||
          !confirm('Are you sure you want to activate?')
        ) {
          return
        }
        await addAgreement(
          addAgreementFromQuoteOptions(
            contract,
            activeFrom,
            null,
            previousAgreementActiveTo,
            quote,
          ),
        )
        if (onSubmitted) {
          onSubmitted()
        }
      }}
    >
      <BottomSpacerWrapper>
        <div>
          <strong>Activation date</strong>
        </div>
        <div>
          <BaseDatePicker
            value={activeFrom}
            onChange={(value) => {
              if (onWipChange) {
                onWipChange(true)
              }
              setActiveFrom(value)
            }}
          />
        </div>
      </BottomSpacerWrapper>

      <BottomSpacerWrapper>
        <Checkbox
          onChange={(_, { checked }) => {
            if (onWipChange) {
              onWipChange(true)
            }
            if (!checked) {
              setPreviousAgreementActiveTo(null)
            }
            setUseGap(checked!)
          }}
          label="Create gap between insurances"
          checked={useGap}
        />
      </BottomSpacerWrapper>

      {useGap && (
        <BottomSpacerWrapper>
          <div>
            <strong>Terminate current insurance at</strong>
          </div>
          <div>
            <BaseDatePicker
              value={previousAgreementActiveTo}
              onChange={(value) => {
                if (onWipChange) {
                  onWipChange(true)
                }
                setPreviousAgreementActiveTo(value)
              }}
              maxDate={activeFrom}
            />
          </div>
        </BottomSpacerWrapper>
      )}

      {!addAgreementMutation.data?.addAgreementFromQuote ? (
        <Button
          variation="success"
          type="submit"
          fullWidth
          disabled={addAgreementMutation.loading}
        >
          Activate
        </Button>
      ) : (
        <Button
          variation="primary"
          fullWidth
          onClick={(e) => {
            e.preventDefault()
            window.location.reload()
          }}
        >
          Reload
        </Button>
      )}

      {addAgreementMutation.error && (
        <ErrorMessage>
          {JSON.stringify(addAgreementMutation.error, null, 2)}
        </ErrorMessage>
      )}
    </form>
  )
}
