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
  withStyles,
} from '@material-ui/core'
import { ExpandMoreOutlined } from '@material-ui/icons'
import { gql } from 'apollo-boost'
import { AddEntryForm } from 'components/chat/tabs/account-tab/add-entry-form'
import { PayoutFormData } from 'components/payouts/payout-details'
import * as React from 'react'
import { Query } from 'react-apollo'
import styled from 'react-emotion'
import { RouteComponentProps } from 'react-router'

export const GET_MEMBER_ACCOUNT_QUERY = gql`
  query GetMemberAccount($memberId: ID!) {
    member(id: $memberId) {
      account {
        id
        balance
        entries {
          id
          amount
          fromDate
          title
        }
      }
    }
  }
`

export interface AccountTabProps {
  showNotification: ({}) => void
}

const TableRowColored = styled(TableRow)(({ amount }: { amount: number }) => ({
  backgroundColor: amount < 0 ? '#FFDDDD' : '#DDFFDD',
}))

const TableCell = withStyles({
  root: {
    fontSize: '1rem',
  },
})(MuiTableCell)

export const AccountTab: React.SFC<
  RouteComponentProps<{ id: string }> & AccountTabProps
> = (props) => (
  <Query
    query={GET_MEMBER_ACCOUNT_QUERY}
    variables={{ memberId: props.match.params.id }}
  >
    {({ data, loading, error }) => {
      if (!data || loading) {
        return 'loading'
      }
      return (
        <>
          <h3>Current balance: {data.member.account.balance.amount} kr</h3>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreOutlined />}>
              <Typography>Add entry</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <AddEntryForm
                memberId={props.match.params.id}
                showNotification={props.showNotification}
              />
            </ExpansionPanelDetails>
          </ExpansionPanel>
          <Paper>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.member.account.entries.map((entry) => (
                  <TableRowColored key={entry.id} amount={entry.amount.amount}>
                    <TableCell>{entry.fromDate}</TableCell>
                    <TableCell>{entry.title}</TableCell>
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
        </>
      )
    }}
  </Query>
)
