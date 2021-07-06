import styled from '@emotion/styled'
import { IconButton } from '@material-ui/core'
import { Quote } from 'api/generated/graphql'
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

  const onPriceChange = (e) => setNewPrice(e.target.value)

  const formattedPrice = quote.price
    ? formatMoney({
        amount: quote.price,
        currency: quote.currency ?? 'SEK',
      })
    : '-'

  const onSubmitNewPrice = (e) => {
    e.preventDefault()
    console.log(e)
  }

  return (
    <PriceWrapper>
      {editPrice ? (
        <form onSubmit={onSubmitNewPrice}>
          <AlignCenter>
            <div>
              <Input type="number" value={newPrice} onChange={onPriceChange} />
            </div>
            <IconButton
              style={{ marginLeft: '12px' }}
              onClick={() => setEditPrice(true)}
            >
              <CheckCircleFill />
            </IconButton>
            <IconButton onClick={() => setEditPrice(false)}>
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
