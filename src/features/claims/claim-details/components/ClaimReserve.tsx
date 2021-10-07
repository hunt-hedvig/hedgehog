import styled from '@emotion/styled'
import { CardTitle, InfoTag, Paragraph, Spinner } from '@hedvig-ui'
import React from 'react'
import { BugFill } from 'react-bootstrap-icons'
import { useClaimReserveQuery } from 'types/generated/graphql'
import { ClaimReserveForm } from './ClaimReserveForm'

const ReservesTag = styled(InfoTag)`
  font-weight: bold;
  font-size: 0.9em;
  width: auto;
  margin-right: 0.5em;
`

const ReservesText = styled(Paragraph)`
  color: ${({ theme }) => theme.semiStrongForeground};
`

export const ClaimReserve: React.FC<{ claimId: string; focus: boolean }> = ({
  claimId,
  focus,
}) => {
  const {
    data: reserveData,
    error: queryError,
    loading: loadingReserve,
  } = useClaimReserveQuery({
    variables: { claimId },
  })

  const reserves = reserveData?.claim?.reserves

  const reserveAmount = reserves && reserves.amount ? reserves.amount : '0.00'
  const reserveCurrency =
    reserves && reserves.currency ? reserves.currency : 'SEK'
  const reserveAmountInteger = Math.round(Number(reserveAmount))

  return (
    <>
      <CardTitle
        title="Reserves"
        badge={
          queryError
            ? {
                icon: BugFill,
                status: 'danger',
                label: 'Internal Error',
              }
            : null
        }
      />
      <div style={{ display: 'flex', marginBottom: '1.0em' }}>
        {loadingReserve && <Spinner />}
        <ReservesTag status="highlight">
          {reserveAmountInteger} {reserveCurrency}
        </ReservesTag>{' '}
        <ReservesText>reserved</ReservesText>
      </div>
      <ClaimReserveForm claimId={claimId} focus={focus} />
    </>
  )
}
