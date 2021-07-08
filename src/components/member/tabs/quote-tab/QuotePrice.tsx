import styled from '@emotion/styled'
import { IconButton } from '@material-ui/core'
import {
  GetQuotesDocument,
  Quote,
  useOverrideQuotePriceMutation,
} from 'api/generated/graphql'
import { Input } from 'hedvig-ui/input'
import React, { useState } from 'react'
import { CheckCircleFill, PencilFill, XCircleFill } from 'react-bootstrap-icons'
import { WithShowNotification } from 'src/store/actions/notificationsActions'
import { formatMoney } from 'utils/money'
import { withShowNotification } from 'utils/notifications'

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

const QuotePrice = ({
  quote,
  showNotification,
}: Props & WithShowNotification) => {
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

  const updateQuotePrice = async () => {
    try {
      await overrideQuotePrice({
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
      showNotification({
        type: 'olive',
        header: 'Price updated',
        message: 'Successfully overrode the quote price',
      })
    } catch (error) {
      showNotification({
        type: 'red',
        header: 'Failed to override quote price',
        message: error.message,
      })
      restorePrice()
    }
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

export default withShowNotification(QuotePrice)
