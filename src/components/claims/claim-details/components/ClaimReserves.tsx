import * as React from 'react'
import styled from 'react-emotion'
import { MonetaryAmount } from '../../../../lib/helpers'
import { ClaimReserveForm } from './ClaimReserveForm'

interface Props {
  reserves: MonetaryAmount
  claimId: string
}

const ReservesWrapper = styled('div')({
  padding: '2rem',
  borderRadius: '4px',
  border: '1px solid rgba(0,0,0,0.08)',
  backgroundColor: 'rgba(0,0,0,0.01)',
})

const ReservesTotal = styled('span')({
  fontSize: '1.125rem',
})

const ClaimReserves: React.SFC<Props> = ({ claimId, reserves }) => {
  const reserveAmount = reserves && reserves.amount ? reserves.amount : '0.00'
  const reserveCurrency =
    reserves && reserves.currency ? reserves.currency : 'SEK'
  const reserveAmountInteger = Math.round(Number(reserveAmount))
  return (
    <ReservesWrapper>
      <ReservesTotal>
        {reserveAmountInteger} {reserveCurrency} Reserved
      </ReservesTotal>
      <ClaimReserveForm claimId={claimId} />
    </ReservesWrapper>
  )
}

export { ClaimReserves }
