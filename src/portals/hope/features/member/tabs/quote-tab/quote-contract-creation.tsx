import { Button, TextDatePicker } from '@hedvig-ui'
import { format } from 'date-fns'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  GetContractsDocument,
  GetQuotesDocument,
  Quote,
  useSignQuoteForNewContractMutation,
} from 'types/generated/graphql'
import { BottomSpacerWrapper, ErrorMessage } from './common'

export const QuoteContractCreation: React.FC<{
  quote: Quote
  memberId
  onSubmitted?: () => void
  onWipChange?: (isWip: boolean) => void
}> = ({
  quote,
  memberId,
  onSubmitted = () => void 0,
  onWipChange = () => void 0,
}) => {
  const [activeFrom, setActiveFrom] = React.useState(() => new Date())
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
        await toast.promise(
          signQuote({
            variables: {
              quoteId: quote.id,
              activationDate: format(activeFrom, 'yyyy-MM-dd'),
            },
            refetchQueries: () => [
              {
                query: GetQuotesDocument,
                variables: { memberId },
              },
              {
                query: GetContractsDocument,
                variables: { memberId },
              },
            ],
          }),
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
          <TextDatePicker
            onChange={(date) => {
              if (!date) {
                return
              }

              if (onWipChange) {
                onWipChange(true)
              }

              setActiveFrom(date)
            }}
            value={activeFrom}
          />
        </div>
      </BottomSpacerWrapper>

      {!setSignQuoteMutation.data?.signQuoteForNewContract ? (
        <Button
          status="success"
          type="submit"
          disabled={setSignQuoteMutation.loading}
        >
          Create contract
        </Button>
      ) : (
        <Button
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
