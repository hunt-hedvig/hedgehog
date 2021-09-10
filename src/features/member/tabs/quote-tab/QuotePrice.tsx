import styled from '@emotion/styled'
import { Input } from '@hedvig-ui'
import { IconButton } from '@material-ui/core'
import {
  GetQuotesDocument,
  Quote,
  useOverrideQuotePriceMutation,
} from 'api/generated/graphql'
import React, { useState } from 'react'
import { CheckCircleFill, PencilFill, XCircleFill } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
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
    if (
      newPrice &&
      window.confirm(
        `Are you sure you want to change the price from ${
          quote.price
        } ${quote.currency ?? ''} to ${newPrice} ${quote.currency ?? ''}?`,
      )
    ) {
      await updateQuotePrice()
    } else {
      restorePrice()
    }
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
            <IconButton type="submit">
              <SubmitButton />
            </IconButton>
            <IconButton onClick={onCancel}>
              <CancelButton />
            </IconButton>
          </AlignCenter>
        </form>
      ) : (
        <AlignCenter>
          <DisplayPrice>{formattedPrice}</DisplayPrice>
          <IconButton onClick={() => setEditPrice(true)}>
            <PencilFill />
          </IconButton>
        </AlignCenter>
      )}
    </PriceWrapper>
  )
}
