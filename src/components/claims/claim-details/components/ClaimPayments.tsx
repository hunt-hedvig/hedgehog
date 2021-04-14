import styled from '@emotion/styled'
import {
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  withStyles,
} from '@material-ui/core'
import { useClaimPaymentsQuery } from 'api/generated/graphql'
import { format, parseISO } from 'date-fns'
import { Spinner } from 'hedvig-ui/sipnner'

import React from 'react'
import { Market } from 'types/enums'
import { Checkmark, Cross } from '../../../icons'
import { Paper } from '../../../shared/Paper'
import { ClaimPayment } from './ClaimPayment'
import { ClaimReserves } from './ClaimReserves'

interface Props {
  claimId: string
}

const ScrollX = styled.div`
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
`
const PaymentTable = withStyles({
  root: {
    marginTop: '1rem',
  },
})(MuiTable)

const PaymentTableCell = withStyles({
  root: {
    fontSize: '1rem',
  },
})(MuiTableCell)

const TotalCell = styled(MuiTableCell)`
  font-size: 1.1rem;
`

const ClaimPayments: React.FC<Props> = ({ claimId }) => {
  const {
    data: paymentsData,
    refetch: refetchPayments,
    loading: loadingPayments,
  } = useClaimPaymentsQuery({
    variables: { claimId },
  })

  const payments = paymentsData?.claim?.payments ?? []
  const identity = paymentsData?.claim?.member?.identity

  const totalAmount = payments
    .map((payment) => +payment?.amount?.amount)
    .reduce((acc, amount) => acc + amount, 0)
  const totalDeductible = payments
    .map((payment) => +payment?.deductible?.amount)
    .reduce((acc, amount) => acc + amount, 0)

  return (
    <Paper>
      <h3>Payments</h3>
      {paymentsData?.claim?.contract?.market === Market.Norway && (
        <p>
          <strong>Identified: {identity ? <Checkmark /> : <Cross />}</strong>
          <br />
          {identity && (
            <p>
              <strong>Personal Number: </strong>
              {identity.nationalIdentification.identification}
              {identity.firstName && identity.lastName && (
                <p>
                  <strong>Name:</strong> {identity.firstName}{' '}
                  {identity.lastName}
                </p>
              )}
            </p>
          )}
        </p>
      )}

      <ClaimReserves
        claimId={claimId}
        reserves={paymentsData?.claim?.reserves}
        refetch={refetchPayments}
        loading={loadingPayments}
      />

      <ScrollX>
        {loadingPayments && <Spinner />}
        <PaymentTable>
          <MuiTableHead>
            <MuiTableRow>
              <PaymentTableCell>Id</PaymentTableCell>
              <PaymentTableCell>Amount</PaymentTableCell>
              <PaymentTableCell>Deductible</PaymentTableCell>
              <PaymentTableCell>Note</PaymentTableCell>
              <PaymentTableCell>Date</PaymentTableCell>
              <PaymentTableCell>Ex Gratia</PaymentTableCell>
              <PaymentTableCell>Type</PaymentTableCell>
              <PaymentTableCell>Status</PaymentTableCell>
            </MuiTableRow>
          </MuiTableHead>
          <MuiTableBody>
            {payments.map((payment) => (
              <MuiTableRow key={payment.id}>
                <PaymentTableCell>{payment.id}</PaymentTableCell>
                <PaymentTableCell>
                  {payment.amount.amount}&nbsp;{payment.amount.currency}
                </PaymentTableCell>
                <PaymentTableCell>
                  {payment.deductible.amount}&nbsp;
                  {payment.deductible.currency}
                </PaymentTableCell>
                <PaymentTableCell>{payment.note}</PaymentTableCell>
                <PaymentTableCell>
                  {format(parseISO(payment.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                </PaymentTableCell>
                <PaymentTableCell>
                  {payment.exGratia ? <Checkmark /> : <Cross />}
                </PaymentTableCell>
                <PaymentTableCell>{payment.type}</PaymentTableCell>
                <PaymentTableCell>{payment.status}</PaymentTableCell>
              </MuiTableRow>
            ))}
            {totalAmount > 0 && (
              <>
                <MuiTableRow>
                  <TotalCell>
                    <b>Amount Total: </b>
                  </TotalCell>
                  <TotalCell align="right">
                    {totalAmount.toFixed(2)}&nbsp;
                    {payments[0]!.amount.currency}
                  </TotalCell>
                </MuiTableRow>
                <MuiTableRow>
                  <TotalCell>
                    <b>Deductible Total: </b>
                  </TotalCell>
                  <TotalCell align="right">
                    {totalDeductible.toFixed(2)}&nbsp;
                    {payments[0]!.deductible.currency}
                  </TotalCell>
                </MuiTableRow>
              </>
            )}
          </MuiTableBody>
        </PaymentTable>
      </ScrollX>

      {paymentsData?.claim && (
        <ClaimPayment
          sanctionStatus={paymentsData?.claim?.member.sanctionStatus}
          claimId={claimId}
          refetch={refetchPayments}
          identified={Boolean(identity)}
          market={paymentsData?.claim?.contract?.market}
          carrier={paymentsData?.claim?.agreement?.carrier}
        />
      )}
    </Paper>
  )
}

export { ClaimPayments }
