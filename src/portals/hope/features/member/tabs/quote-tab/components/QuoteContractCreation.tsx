import { Button, Label, Spacing, TextDatePicker } from '@hedvig-ui'
import React from 'react'
import { toast } from 'react-hot-toast'
import {
  GetContractsDocument,
  MemberQuotesDocument,
  Quote,
  useSignQuoteForNewContractMutation,
} from 'types/generated/graphql'
import { getTodayFormatDate } from 'portals/hope/features/member/tabs/contracts-tab/agreement/helpers'

export const QuoteContractCreation: React.FC<{
  quote: Quote
  memberId: string
  onSubmitted?: () => void
  onWipChange?: (isWip: boolean) => void
}> = ({
  quote,
  memberId,
  onSubmitted = () => void 0,
  onWipChange = () => void 0,
}) => {
  const [activeFrom, setActiveFrom] = React.useState<string | null>(
    getTodayFormatDate(),
  )
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
              activationDate: activeFrom,
            },
            refetchQueries: () => [
              {
                query: MemberQuotesDocument,
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
      <div style={{ padding: '1rem' }}>
        <div>
          <Label>Activation date</Label>
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
        <Spacing bottom="small" />
        {!setSignQuoteMutation.data?.signQuoteForNewContract ? (
          <Button type="submit" disabled={setSignQuoteMutation.loading}>
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
      </div>
    </form>
  )
}
