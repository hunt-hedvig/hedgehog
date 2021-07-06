import styled from '@emotion/styled'
import { IconButton } from '@material-ui/core'
import {
  GetQuotesDocument,
  Quote,
  useOverrideQuotePriceMutation,
} from 'api/generated/graphql'
import { Button } from 'hedvig-ui/button'
import { Input } from 'hedvig-ui/input'
import React, { useState } from 'react'
import { CheckCircleFill, PencilFill, XCircleFill } from 'react-bootstrap-icons'

import { formatMoney } from 'utils/money'

const PriceWrapper = styled('div')({
  paddingBottom: '1rem',
})

const DisplayPrice = styled('div')({
  lineHeight: 1.2,
  fontSize: '2rem',
})

const AlignCenter = styled('div')({
  display: 'flex',
  alignItems: 'center',
})

interface Props {
  quote: Quote
}

const QuotePrice = ({ quote }: Props) => {
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

  const onSubmitNewPrice = (e) => {
    e.preventDefault()
    if (newPrice) {
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
      })
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
            <div>
              <Input type="number" value={newPrice} onChange={onPriceChange} />
            </div>
            <IconButton style={{ marginLeft: '12px' }} type="submit">
              <CheckCircleFill />
            </IconButton>
            <IconButton onClick={onCancel}>
              <XCircleFill />
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

export default QuotePrice
