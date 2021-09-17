import styled from '@emotion/styled'
import { Button, StandaloneMessage, ThirdLevelHeadline } from '@hedvig-ui'
import {
  createQuoteFromAgreementOptions,
  useCreateQuoteFromAgreement,
} from 'graphql/use-create-quote'
import { useQuotes } from 'graphql/use-get-quotes'
import React from 'react'
import { toast } from 'react-hot-toast'
import { Contract, GenericAgreement } from 'types/generated/graphql'
import { useConfirmDialog } from 'utils/hooks/modal-hook'
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
  const { confirm } = useConfirmDialog()

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

  const createQuoteHandler = () => {
    confirm(`Create new quote?`).then(() => {
      toast.promise(
        createQuote(createQuoteFromAgreementOptions(agreement, contract)),
        {
          loading: 'Creating quote',
          success: 'Quote created, find it under the quotes tab',
          error: 'Could not create quote',
        },
      )
    })
  }

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
            onClick={createQuoteHandler}
          >
            Create a new quote
          </Button>
        )}
      </>
    </>
  )
}
