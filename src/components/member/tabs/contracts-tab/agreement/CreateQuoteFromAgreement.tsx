import * as React from 'react'
import { Button } from '../../../../../../shared/hedvig-ui/button'
import { ThirdLevelHeadline } from '../../../../../../shared/hedvig-ui/typography'
import {
  Agreement,
  Contract,
  QuoteState,
} from '../../../../../api/generated/graphql'
import {
  createQuoteFromAgreementOptions,
  useCreateQuoteFromAgreement,
} from '../../../../../graphql/use-create-quote'
import { useQuotes } from '../../../../../graphql/use-quotes'
import { Notification } from '../../../../../store/actions/notificationsActions'

export const CreateQuoteFromAgreement: React.FunctionComponent<{
  agreement: Agreement
  contract: Contract
  showNotification: (data: Notification) => void
}> = ({ agreement, contract, showNotification }) => {
  const [createQuote] = useCreateQuoteFromAgreement()
  const [quotes, loadingQuotes] = useQuotes(contract.holderMemberId)

  return (
    <>
      <ThirdLevelHeadline>Create Quote</ThirdLevelHeadline>
      <>
        {quotes
          .filter((quote) => quote.state === QuoteState.Quoted)
          .map((quote) => quote.originatingProductId)
          .includes(agreement.id) && !loadingQuotes ? (
          <>Agreement has an existing quote</>
        ) : (
          <Button
            variation={'secondary'}
            fullWidth
            onClick={() => {
              if (!window.confirm(`Create new quote?`)) {
                return
              }
              createQuote(createQuoteFromAgreementOptions(agreement, contract))
                .then(() => {
                  showNotification({
                    type: 'olive',
                    header: 'Success',
                    message: `Successfully added a quote, go to the quotes tab to view it`,
                  })
                })
                .catch((error) => {
                  showNotification({
                    type: 'red',
                    header: 'Error',
                    message: error.message,
                  })
                  throw error
                })
            }}
          >
            Create Quote
          </Button>
        )}
      </>
    </>
  )
}
