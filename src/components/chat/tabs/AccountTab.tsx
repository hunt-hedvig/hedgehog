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
import * as React from 'react'
import { Query } from 'react-apollo'
import styled from 'react-emotion'
import { RouteComponentProps } from 'react-router'
import { formatMoneySE } from 'lib/intl'

export const GET_MEMBER_ACCOUNT_QUERY = gql`
  query GetMemberAccount($memberId: ID!) {
    member(id: $memberId) {
      firstName
      account {
        id
        balance
        entries {
          id
          amount
          fromDate
          title
          source
          reference
        }
      }
    }
  }
`

export interface AccountTabProps {
  showNotification: (notification: {}) => void
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
    {({ data, loading }) => {
      if (!data || loading) {
        return 'loading'
      }
      return (
        <>
          <h3>Current balance: {formatMoneySE(data.member.account.balance)}</h3>
          <ExpansionPanel>
            <ExpansionPanelSummary expandIcon={<ExpandMoreOutlined />}>
              <Typography>Add entry</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <AddEntryForm
                memberId={props.match.params.id}
                firstName={data.member.firstName}
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
                    <TableCell>
                      {entry.id}
                      <br />
                      {entry.title
                        ? entry.title
                        : `${entry.reference} (${entry.source})`}
                    </TableCell>
                    <TableCell align="right">
                      <strong>{formatMoneySE(entry.amount)}</strong>
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
