import {
  Quote,
  useSignQuoteForNewContractMutation,
} from 'api/generated/graphql'
import { BaseDatePicker } from 'components/shared/inputs/DatePicker'
import { Button } from 'hedvig-ui/button'
import * as React from 'react'
import { noopFunction } from 'utils'
import { BottomSpacerWrapper, ErrorMessage } from './common'
import { signQuoteForNewContractOptions } from 'graphql/use-sign-quote-for-new-contract'

export const QuoteContractCreation: React.FC<{
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
  const [activeFrom, setActiveFrom] = React.useState<Date>(new Date())
  const [signQuote, setSignQuoteMutation] = useSignQuoteForNewContractMutation()

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()
        if (
          setSignQuoteMutation.loading ||
          !activeFrom ||
          !confirm('Are you sure you want to create a new contract?')
        ) {
          return
        }
        await signQuote(
          signQuoteForNewContractOptions(quote.id, activeFrom, memberId),
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

      {!setSignQuoteMutation.data?.signQuoteForNewContract ? (
        <Button
          variation="success"
          type="submit"
          fullWidth
          disabled={setSignQuoteMutation.loading}
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

      {setSignQuoteMutation.error && (
        <ErrorMessage>
          {JSON.stringify(setSignQuoteMutation.error, null, 2)}
        </ErrorMessage>
      )}
    </form>
  )
}
