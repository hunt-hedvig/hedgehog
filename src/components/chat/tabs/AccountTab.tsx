import {
  ExpansionPanel,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableHead,
  TableRow,
  TextField as MuiTextField,
  Typography,
  withStyles,
} from '@material-ui/core'
import { ExpandMoreOutlined } from '@material-ui/icons'
import {AddEntryForm} from "components/chat/tabs/account-tab/add-entry-form"
import { DatePicker } from 'components/shared/inputs/DatePicker'
import { FieldSelect } from 'components/shared/inputs/FieldSelect'
import { format } from 'date-fns'
import { Field, Form, Formik } from 'formik'
import * as React from 'react'
import styled from 'react-emotion'

const rows = [
  {
    id: 1,
    fromDate: new Date(),
    title: 'Månadsavgift (Hemförsäkring)',
    amount: { amount: -100, currency: 'SEK' },
  },
  {
    id: 2,
    fromDate: new Date(),
    title: 'Månadsavgift (Objektförsärking)',
    amount: { amount: -50, currency: 'SEK' },
  },
  {
    id: 3,
    fromDate: new Date(),
    title: 'Månadsavgift (Hemförsäkring)',
    amount: { amount: -100, currency: 'SEK' },
  },
  {
    id: 4,
    fromDate: new Date(),
    title: 'Gratismånad (Hemförsäkring)',
    amount: { amount: 100, currency: 'SEK' },
  },
]

const TableRowColored = styled(TableRow)(({ amount }: { amount: number }) => ({
  backgroundColor: amount < 0 ? '#FFDDDD' : '#DDFFDD',
}))

const TableCell = withStyles({
  root: {
    fontSize: '1rem',
  },
})(MuiTableCell)

export const AccountTab: React.SFC = () => (
  <>
    <h3>Current balance: -150 kr</h3>
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreOutlined />}>
        <Typography>Add entry</Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <AddEntryForm />
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
          {rows.map((row) => (
            <TableRowColored key={row.id} amount={row.amount.amount}>
              <TableCell>{format(row.fromDate, 'yyyy-mm-dd')}</TableCell>
              <TableCell>{row.title}</TableCell>
              <TableCell align="right">
                <strong>
                  {row.amount.amount} {row.amount.currency}
                </strong>
              </TableCell>
            </TableRowColored>
          ))}
        </TableBody>
      </Table>
    </Paper>
  </>
)
