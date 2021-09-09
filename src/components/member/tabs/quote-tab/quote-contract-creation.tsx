import { Button, DateTimePicker } from '@hedvig-ui'
import { Quote } from 'api/generated/graphql'
import {
  getSignQuoteForNewContractOptions,
  useSignQuoteForNewContract,
} from 'graphql/use-sign-quote-for-new-contract'
import React from 'react'
import { toast } from 'react-hot-toast'
import { noopFunction } from 'utils'
import { BottomSpacerWrapper, ErrorMessage } from './common'

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
  const [activeFrom, setActiveFrom] = React.useState(() => new Date())
  const [signQuote, setSignQuoteMutation] = useSignQuoteForNewContract()

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
        await toast.promise(
          signQuote(
            getSignQuoteForNewContractOptions(quote.id, activeFrom, memberId),
          ),
          {
            loading: 'Creating contract',
            success: 'Contract created',
            error: 'Could not create contract',
          },
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
          <DateTimePicker
            date={activeFrom}
            setDate={(value) => {
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
          Create contract
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
