import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core'
import { Market } from 'types/enums'

import { Field, Form, Formik } from 'formik'
import React from 'react'
import * as yup from 'yup'

interface PaymentConfirmationDialogProps {
  onClose: () => void
  onSubmit: () => void
  amount: string
  identified: boolean
  market: string | null
}

const CustomTextField = ({ field, form, ...props }) => {
  return <TextField {...field} {...props} />
}

const paymentConfirmValidationSchema = (amount: string) =>
  yup.object().shape({
    confirmation: yup.string().matches(new RegExp(`^${amount}$`)),
  })

interface ConfirmationData {
  confirmation: string
}

export const PaymentConfirmationDialog: React.FC<PaymentConfirmationDialogProps> = ({
  onClose,
  onSubmit,
  amount,
  identified,
  market,
}) => {
  return (
    <Dialog open={true} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Payment Confirmation</DialogTitle>

      <DialogContent>
        {!identified && market === Market.Norway && (
          <DialogContentText>
            ⚠️ Please note that this member is not identified
          </DialogContentText>
        )}
        <br />
        <DialogContentText>
          Please enter "{amount}" and submit to confirm payment.
          <br />
          Once confirmed, an amount of {amount} will be paid out to support this
          claim.
        </DialogContentText>
        <Formik<ConfirmationData>
          initialValues={{ confirmation: '' }}
          onSubmit={(_, { resetForm }) => {
            onSubmit()
            resetForm()
            onClose()
          }}
          validationSchema={paymentConfirmValidationSchema(amount)}
        >
          {({ isValid }) => (
            <Form>
              <Field
                component={CustomTextField}
                autoFocus
                margin="dense"
                id="confirmation"
                name="confirmation"
                label="Confirmation"
                type="text"
                placeholder="Amount to be paid"
                fullWidth
              />
              <DialogActions>
                <Button onClick={onClose} color="primary">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  disabled={!isValid}
                  variant="contained"
                >
                  Confirm Payment
                </Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  )
}
