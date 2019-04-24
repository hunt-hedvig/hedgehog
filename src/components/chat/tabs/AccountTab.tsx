import {
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableHead,
  TableRow,
  TextField,
  withStyles,
} from '@material-ui/core'
import { FieldSelect } from 'components/shared/inputs/FieldSelect'
import { format } from 'date-fns'
import { Field, Form, Formik } from 'formik'
import * as React from 'react'
import styled from 'react-emotion'
import { DatePicker } from 'components/shared/inputs/DatePicker'

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
    <Formik onSubmit={() => {}} initialValues={{ category: '' }}>
      <Form>
        <h4>Make entry</h4>
        <Field component={FieldSelect} name="category">
          <MenuItem value="CORRECTION">Correction</MenuItem>
          <MenuItem value="CAMPAIGN">Campaign</MenuItem>
        </Field>
        <Field
          component={TextField}
          label="Amount"
          type="number"
          name="amount"
        />
        <Field
          component={TextField}
          label="Reference"
          name="reference"
          placeholder="123123"
        />
        <Field
          component={TextField}
          label="Source"
          name="source"
          placeholder="Member"
        />
        <Field
          component={DatePicker}
          label="From date"
          type="date"
          name="fromDate"
        />
      </Form>
    </Formik>

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
