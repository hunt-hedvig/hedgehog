import {
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  withStyles,
} from '@material-ui/core'
import { Claim, SanctionStatus } from 'api/generated/graphql'
import { format, parseISO } from 'date-fns'

import * as React from 'react'

import { MonetaryAmount } from '../../../../lib/helpers'
import { Checkmark, Cross } from '../../../icons'
import { Paper } from '../../../shared/Paper'
import { ClaimPayment } from './ClaimPayment'
import { ClaimReserves } from './ClaimReserves'

interface Props {
  payments: NonNullable<Claim['payments']>
  claimId: string
  reserves: MonetaryAmount
  sanctionStatus: SanctionStatus
  refetchPage: () => Promise<any>
}

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

const ClaimPayments: React.SFC<Props> = ({
  payments,
  claimId,
  reserves,
  sanctionStatus,
  refetchPage,
}) => {
  return (
    <Paper>
      <h3>Payments</h3>
      <ClaimReserves
        claimId={claimId}
        reserves={reserves}
        refetchPage={refetchPage}
      />

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
            <MuiTableRow
              key={
                payment!.amount.amount +
                payment!.amount.currency +
                payment!.timestamp
              }
            >
              <PaymentTableCell>{payment!.id}</PaymentTableCell>
              <PaymentTableCell>
                {payment!.amount.amount} {payment!.amount.currency}
              </PaymentTableCell>
              <PaymentTableCell>
                {payment!.deductible.amount} {payment!.deductible.currency}
              </PaymentTableCell>
              <PaymentTableCell>{payment!.note}</PaymentTableCell>
              <PaymentTableCell>
                {format(parseISO(payment!.timestamp), 'yyyy-MM-dd hh:mm:ss')}
              </PaymentTableCell>
              <PaymentTableCell>
                {payment!.exGratia ? <Checkmark /> : <Cross />}
              </PaymentTableCell>
              <PaymentTableCell>{payment!.type}</PaymentTableCell>
              <PaymentTableCell>{payment!.status}</PaymentTableCell>
            </MuiTableRow>
          ))}
        </MuiTableBody>
      </PaymentTable>

      <ClaimPayment
        sanctionStatus={sanctionStatus}
        claimId={claimId}
        refetchPage={refetchPage}
      />
    </Paper>
  )
}

export { ClaimPayments }
