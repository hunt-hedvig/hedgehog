import * as React from 'react'
import styled from 'react-emotion'
import { MonetaryAmount } from './ClaimPayments'
import { ClaimReserveForm } from './ClaimReserveForm'

interface Props {
  reserves: MonetaryAmount
  claimId: string
}

const ReservesTotal = styled('span')({})

const ClaimReserves: React.SFC<Props> = ({ claimId, reserves }) => (
  <div>
    <ReservesTotal>
      {reserves && reserves.amount ? reserves.amount : '0.00'}{' '}
      {reserves && reserves.currency ? reserves.currency : 'SEK'}
    </ReservesTotal>
    <ClaimReserveForm claimId={claimId} />
  </div>
)

export { ClaimReserves }
