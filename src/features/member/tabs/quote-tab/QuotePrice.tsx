import styled from '@emotion/styled'
import { Button, Input } from '@hedvig-ui'
import React, { useState } from 'react'
import { CheckCircleFill, PencilFill, XCircleFill } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import {
  GetQuotesDocument,
  Quote,
  useOverrideQuotePriceMutation,
} from 'types/generated/graphql'
import { useConfirmDialog } from 'utils/hooks/modal-hook'
import { formatMoney } from 'utils/money'

const PriceWrapper = styled.div`
  padding-bottom: 1rem;
`

const DisplayPrice = styled.div`
  line-height: 1.2;
  font-size: 2rem;
`

const AlignCenter = styled.div`
  display: flex;
  align-items: center;
`
const PriceInput = styled.div`
  margin-right: 12px;
`

const SubmitButton = styled(CheckCircleFill)`
  color: ${({ theme }) => theme.success};
`
const CancelButton = styled(XCircleFill)`
  color: ${({ theme }) => theme.accent};
`

interface Props {
  quote: Quote
}

export const QuotePrice = ({ quote }: Props) => {
  const [editPrice, setEditPrice] = useState(false)
  const [newPrice, setNewPrice] = useState(quote.price)
  const [overrideQuotePrice] = useOverrideQuotePriceMutation()
  const { confirm } = useConfirmDialog()

  const onPriceChange = (e) => setNewPrice(e.target.value)
  const restorePrice = () => setNewPrice(quote.price)

  const onCancel = () => {
    restorePrice()
    setEditPrice(false)
  }

  const formattedPrice = quote.price
    ? formatMoney({
        amount: quote.price,
        currency: quote.currency ?? 'SEK',
      })
    : '-'

  const updateQuotePrice = () => {
    toast.promise(
      overrideQuotePrice({
        variables: {
          input: {
            quoteId: quote.id,
            price: newPrice,
          },
        },
        refetchQueries: [
          {
            query: GetQuotesDocument,
            variables: { memberId: quote.memberId },
          },
        ],
      }),
      {
        loading: 'Overriding quote price',
        success: 'Quote price overriden',
        error: () => {
          restorePrice()
          return 'Could not override quote price'
        },
      },
    )
  }

  const onSubmitNewPrice = async (e) => {
    e.preventDefault()
    const confirmMessage = `Are you sure you want to change the price from ${
      quote.price
    } ${quote.currency ?? ''} to ${newPrice} ${quote.currency ?? ''}?`

    await confirm(confirmMessage)
      .then(async () => updateQuotePrice())
      .catch(() => restorePrice())

    setEditPrice(false)
  }

  return (
    <PriceWrapper>
      {editPrice ? (
        <form onSubmit={onSubmitNewPrice}>
          <AlignCenter>
            <PriceInput>
              <Input
                autoFocus
                type="number"
                value={newPrice}
                onChange={onPriceChange}
              />
            </PriceInput>
            <Button variant="tertiary" type="submit">
              <SubmitButton size="1.6em" />
            </Button>
            <Button variant="tertiary" onClick={onCancel}>
              <CancelButton size="1.6em" />
            </Button>
          </AlignCenter>
        </form>
      ) : (
        <AlignCenter>
          <DisplayPrice>{formattedPrice}</DisplayPrice>
          <Button variant="tertiary" onClick={() => setEditPrice(true)}>
            <PencilFill />
          </Button>
        </AlignCenter>
      )}
    </PriceWrapper>
  )
}
