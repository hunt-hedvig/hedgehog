import {
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
} from '@material-ui/core'

import format from 'date-fns/format'
import toDate from 'date-fns/toDate'
import * as React from 'react'
import styled from 'react-emotion'

import { Checkmark, Cross } from '../../../icons'
import { Paper } from '../../../shared/Paper'
import { ClaimPayment } from './ClaimPayment'
import { ClaimReserves } from './ClaimReserves'
import { SanctionStatus } from './MemberInformation'

export interface MonetaryAmount {
  amount: string
  currency: string
}

interface Props {
  payments: Payment[]
  claimId: string
  reserves: MonetaryAmount
  sanctionStatus: SanctionStatus
}

interface Payment {
  id: string
  amount: MonetaryAmount
  deductible: MonetaryAmount
  note: string
  timestamp: string
  type: string
  exGratia: boolean
  status: string
}

const PaymentTable = styled(MuiTable)({
  marginTop: '1rem',
  '*': {
    fontSize: '1rem',
  },
})

const ClaimPayments: React.SFC<Props> = ({
  payments,
  claimId,
  reserves,
  sanctionStatus,
}) => {
  return (
    <Paper>
      <h3>Payments</h3>
      <ClaimReserves claimId={claimId} reserves={reserves} />

      <PaymentTable>
        <MuiTableHead>
          <MuiTableRow>
            <MuiTableCell>Id</MuiTableCell>
            <MuiTableCell>Amount</MuiTableCell>
            <MuiTableCell>Deductible</MuiTableCell>
            <MuiTableCell>Note</MuiTableCell>
            <MuiTableCell>Date</MuiTableCell>
            <MuiTableCell>Ex Gratia</MuiTableCell>
            <MuiTableCell>Type</MuiTableCell>
            <MuiTableCell>Status</MuiTableCell>
          </MuiTableRow>
        </MuiTableHead>
        <MuiTableBody>
          {payments.map((payment) => (
            <MuiTableRow
              key={
                payment.amount.amount +
                payment.amount.currency +
                payment.timestamp
              }
            >
              <MuiTableCell>{payment.id}</MuiTableCell>
              <MuiTableCell>
                {payment.amount.amount} {payment.amount.currency}
              </MuiTableCell>
              <MuiTableCell>
                {payment.deductible.amount} {payment.deductible.currency}
              </MuiTableCell>
              <MuiTableCell>{payment.note}</MuiTableCell>
              <MuiTableCell>
                {format(toDate(payment.timestamp), 'yyyy-MM-dd hh:mm:ss')}
              </MuiTableCell>
              <MuiTableCell>
                {payment.exGratia ? <Checkmark /> : <Cross />}
              </MuiTableCell>
              <MuiTableCell>{payment.type}</MuiTableCell>
              <MuiTableCell>{payment.status}</MuiTableCell>
            </MuiTableRow>
          ))}
        </MuiTableBody>
      </PaymentTable>

      <ClaimPayment sanctionStatus={sanctionStatus} claimId={claimId} />
    </Paper>
  )
}

export { ClaimPayments }
