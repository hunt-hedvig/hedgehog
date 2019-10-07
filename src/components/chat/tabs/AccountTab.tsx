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
import { formatMoneySE } from 'lib/intl'
import * as React from 'react'
import { Query } from 'react-apollo'
import styled from 'react-emotion'
import { RouteComponentProps } from 'react-router'

export const GET_MEMBER_ACCOUNT_QUERY = gql`
  query GetMemberAccount($memberId: ID!) {
    member(id: $memberId) {
      firstName
      account {
        id
        currentBalance
        totalBalance
        entries {
          id
          amount
          fromDate
          title
          source
          reference
          type
          failedAt
          chargedAt
        }
      }
    }
  }
`

export interface AccountTabProps {
  showNotification: (notification: {}) => void
}

const TableRowColored = styled(TableRow)(({ entry }: { entry }) => {
  let backgroundColor
  if (entry.failedAt) {
    backgroundColor = '#FFDDDD'
  } else if (entry.amount.amount < 0) {
    backgroundColor = '#FFFFDD'
  } else {
    backgroundColor = '#DDFFDD'
  }
  return { backgroundColor }
})

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
          <h3>
            Balance (current month):{' '}
            {formatMoneySE(data.member.account.currentBalance)}
          </h3>
          <h3>
            Balance (total): {formatMoneySE(data.member.account.totalBalance)}
          </h3>
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
                  <TableCell>Type</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Amount</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.member.account.entries.map((entry) => (
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
