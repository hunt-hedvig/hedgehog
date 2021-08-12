import styled from '@emotion/styled'
import { Contract, GenericAgreement } from 'api/generated/graphql'
import {
  createQuoteFromAgreementOptions,
  useCreateQuoteFromAgreement,
} from 'graphql/use-create-quote'
import { useQuotes } from 'graphql/use-get-quotes'
import { StandaloneMessage } from 'hedvig-ui/animations/standalone-message'
import { Button } from 'hedvig-ui/button'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { toast } from 'react-hot-toast'
import { isExpired } from 'utils/quote'

const QuoteMessage = styled(StandaloneMessage)`
  font-size: 1.1rem;
`

export const CreateQuoteFromAgreement: React.FC<{
  agreement: GenericAgreement
  contract: Contract
}> = ({ agreement, contract }) => {
  const [createQuote] = useCreateQuoteFromAgreement()
  const [{ quotes }, { loading: loadingQuotes }] = useQuotes(
    contract.holderMemberId,
  )

  if (loadingQuotes) {
    return null
  }

  if (!quotes) {
    return (
      <>
        <ThirdLevelHeadline>Create Quote</ThirdLevelHeadline>
        <QuoteMessage>Failed to retrieve quotes</QuoteMessage>
      </>
    )
  }

  const quoteAlreadyExists = quotes
    .filter((quote) => quote.state === 'QUOTED' && !isExpired(quote))
    .map((quote) => quote.originatingProductId)
    .includes(agreement.id)

  return (
    <>
      <ThirdLevelHeadline>Create Quote</ThirdLevelHeadline>
      <>
        {quoteAlreadyExists ? (
          <QuoteMessage>Agreement already has an existing quote</QuoteMessage>
        ) : (
          <Button
            disabled={contract.isLocked}
            variation="primary"
            onClick={async () => {
              if (!window.confirm(`Create new quote?`)) {
                return
              }
              await toast.promise(
                createQuote(
                  createQuoteFromAgreementOptions(agreement, contract),
                ),
                {
                  loading: 'Creating quote',
                  success: 'Quote created, find it under the quotes tab',
                  error: 'Could not create quote',
                },
              )
            }}
          >
            Create a new quote
          </Button>
        )}
      </>
    </>
  )
}
