import styled from '@emotion/styled'
import { InfoTag, Paragraph, Spinner, ThirdLevelHeadline } from '@hedvig-ui'
import React from 'react'
import { MonetaryAmount } from '../../../../utils/helpers'
import { ClaimReserveForm } from './ClaimReserveForm'

interface Props {
  reserves: MonetaryAmount
  claimId: string
  loading?: boolean
  refetch: () => Promise<any>
}

const ReservesCard = styled.div`
  width: 100%;
  padding: 2rem;
  border-radius: 7px;
  border: none;
  background-color: rgba(0, 0, 0, 0.05);
`

const ReservesTag = styled(InfoTag)`
  font-weight: bold;
  font-size: 0.9em;
  width: auto;
  margin-right: 0.5em;
`

const ReservesText = styled(Paragraph)`
  color: ${({ theme }) => theme.semiStrongForeground};
`

export const ClaimReserves: React.FC<Props> = ({
  claimId,
  reserves,
  loading,
}) => {
  const reserveAmount = reserves && reserves.amount ? reserves.amount : '0.00'
  const reserveCurrency =
    reserves && reserves.currency ? reserves.currency : 'SEK'
  const reserveAmountInteger = Math.round(Number(reserveAmount))

  return (
    <ReservesCard>
      <ThirdLevelHeadline>Reserves</ThirdLevelHeadline>
      <div style={{ display: 'flex', marginBottom: '1.0em' }}>
        {loading && <Spinner />}
        <ReservesTag status="highlight">
          {reserveAmountInteger} {reserveCurrency}
        </ReservesTag>{' '}
        <ReservesText>reserved</ReservesText>
      </div>
      <ClaimReserveForm claimId={claimId} />
    </ReservesCard>
  )
}
