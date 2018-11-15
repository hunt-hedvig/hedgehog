import * as React from 'react'
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Checkbox as MuiCheckbox, TextField as MuiTextField, Select as MuiSelect, FormControlLabel } from '@material-ui/core';
import { parse, format } from 'date-fns'
import { CustomPaper } from './Styles'
import { Checkmark, Cross } from '../../../icons'
import { Formik, Form, Field, FieldProps } from 'formik';
import styled from 'react-emotion';

interface Props {
  payments: Array<Payment>
  createPayment: (any) => void
}

interface Payment {
  amount: {
    amount: string
    currency: string
  }
  note: string
  timestamp: string
  type: string
  exGratia: boolean
}

interface TextFieldProps {
  placeholder: string
}

const Checbox: React.SFC<FieldProps> = ({ field: { onChange, onBlur, name, value } }) => (
  <MuiCheckbox
    onChange={onChange}
    onBlur={onBlur}
    name={name}
    value={value || ''}
    color="primary"
  />
)

const TextField: React.SFC<FieldProps & TextFieldProps> = ({ field: { onChange, onBlur, name, value }, placeholder }) => (
  <MuiTextField
    onChange={onChange}
    onBlur={onBlur}
    name={name}
    value={value || ''}
    placeholder={placeholder}
    autoComplete="off"
  />
)

const Select: React.SFC<FieldProps> = ({ field: { onChange, onBlur, name, value }, children }) => (
  <MuiSelect
    onChange={onChange}
    onBlur={onBlur}
    name={name}
    value={value}
    native
  >
    {children}
  </MuiSelect>
)

const CustomForm = styled(Form)({
  display: 'flex',
  flexDirection: 'column'
})

const ClaimPayments: React.SFC<Props> = ({ payments, createPayment }) => (
  <CustomPaper>
    <h3>Payments</h3>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Amount</TableCell>
          <TableCell>Note</TableCell>
          <TableCell>Date</TableCell>
          <TableCell>Ex Gratia</TableCell>
          <TableCell>Type</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {payments.map(payment => (
          <TableRow key={payment.amount.amount + payment.amount.currency + payment.timestamp}>
            <TableCell>{payment.amount.amount} {payment.amount.currency}</TableCell>
            <TableCell>{payment.note}</TableCell>
            <TableCell>{format(parse(payment.timestamp), 'YYYY-MM-DD hh:mm:ss')}</TableCell>
            <TableCell>{payment.exGratia ? <Checkmark /> : <Cross />}</TableCell>
            <TableCell>{payment.type}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
    <Formik initialValues={{ type: "Manual" }} onSubmit={(values, { setSubmitting, resetForm }) => {
      createPayment({
        amount: {
          amount: +values.amount, currency: 'SEK'
        },
        note: values.note,
        exGratia: values.exGratia || false,
        type: values.type
      })
      setSubmitting(false)
      resetForm()
    }}>
      <CustomForm>
        <Field component={TextField} placeholder="Payment amount" name="amount" />
        <Field component={TextField} placeholder="Note" name="note" />
        <FormControlLabel
          label="Ex Gratia?"
          control={
            <Field component={Checbox} name="exGratia" />
          }
        />
        <Field component={Select} name="type">
          <option value="Manual">Manual</option>
          <option value="Trustly">Trustly</option>
        </Field>
        <Button type="submit" variant="contained" color="primary">Create payment</Button>
      </CustomForm>
    </Formik>
  </CustomPaper>
)

export { ClaimPayments }
