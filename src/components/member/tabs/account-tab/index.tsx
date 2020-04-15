import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  Paper,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core'
import { ExpandMoreOutlined } from '@material-ui/icons'
import { ContractMarketInfo } from 'api/generated/graphql'
import { AddEntryForm } from 'components/member/tabs/account-tab/add-entry-form'
import { BackfillSubscriptionsButton } from 'components/member/tabs/account-tab/backfill-subscriptions-button'
import { useGetAccount } from 'graphql/use-get-account'
import * as React from 'react'
import styled from 'react-emotion'
import { formatMoney } from 'utils/money'

export interface AccountTabProps {
  memberId: string
  contractMarketInfo: ContractMarketInfo
  showNotification: (notification: {}) => void
}

const TableRowColored = styled(TableRow)(({ entry }: { entry }) => {
  if (entry.failedAt) {
    return { backgroundColor: '#FFDDDD' }
  } else if (entry.amount.amount < 0) {
    return { backgroundColor: '#FFFFDD' }
  } else {
    return { backgroundColor: '#DDFFDD' }
  }
})

const TableCell = styled(MuiTableCell)({
  fontSize: '1rem',
})

export const AccountTab: React.FC<AccountTabProps> = ({
  memberId,
  contractMarketInfo,
  showNotification,
}) => {
  const [account, { loading }] = useGetAccount(memberId)
  if (loading) {
    return <>Loading...</>
  }
  if (!account) {
    return <>No account found :(</>
  }
  return (
    <>
      <h3>Balance (current month): {formatMoney(account.currentBalance)}</h3>
      <h3>Balance (total): {formatMoney(account.totalBalance)}</h3>
      <h3>Upcoming charge information:</h3>
      <p>
        <b>Total discount amount:</b>{' '}
        {formatMoney(account.chargeEstimation.discount)}
      </p>
      <p>
        <b>Subscription charge:</b>{' '}
        {formatMoney(account.chargeEstimation.subscription)}
      </p>
      <p>
        <b>Discount references:</b> {account.chargeEstimation.discountCodes}
      </p>
      <h5>
        Total charge next month: {formatMoney(account.chargeEstimation.charge)}
      </h5>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreOutlined />}>
          <Typography>Add entry</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <AddEntryForm
            memberId={memberId}
            preferredCurrency={contractMarketInfo.preferredCurrency}
            showNotification={showNotification}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Title</TableCell>
              <TableCell align="right">Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {account.entries.map((entry) => (
              <TableRowColored key={entry.id} entry={entry}>
                <TableCell>{entry.fromDate}</TableCell>
                <TableCell>{entry.type.toLowerCase()}</TableCell>
                <TableCell>
                  {entry.id}
                  <br />
                  {entry.title
                    ? entry.title
                    : `${entry.reference} (${entry.source})`}
                </TableCell>
                <TableCell align="right">
                  <strong>
                    {entry.amount.amount} {entry.amount.currency}
                  </strong>
                </TableCell>
              </TableRowColored>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <BackfillSubscriptionsButton
        memberId={memberId}
        showNotification={showNotification}
      />
    </>
  )
}
