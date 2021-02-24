import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core'
import { PaymentSwishFormData } from './ClaimSwishPayment'

import { Field, Form, Formik } from 'formik'
import React from 'react'
import * as yup from 'yup'

interface PaymentConfirmationDialogProps {
  onClose: () => void
  onSubmit: (claimVariables: object) => void
  payment: PaymentSwishFormData
  claimId: string
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

export const SwishPaymentConfirmationDialog: React.SFC<PaymentConfirmationDialogProps> = ({
  onClose,
  onSubmit,
  payment,
  claimId,
}) => {
  return (
    <Dialog open={true} onClose={onClose} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">Payment Confirmation</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Please enter "{payment.amount}" and submit to confirm payment.
          <br />
          Once confirmed, an amount of {payment.amount} will be paid out to
          support this claim.
        </DialogContentText>
        <Formik<ConfirmationData>
          initialValues={{ confirmation: '' }}
          onSubmit={(_, { resetForm }) => {
            onSubmit({
              variables: {
                id: claimId,
                payment: {
                  amount: {
                    amount: +payment.amount,
                    currency: 'SEK',
                  },
                  deductible: {
                    amount: +payment.deductible,
                    currency: 'SEK',
                  },
                  sanctionListSkipped: payment.overridden
                    ? payment.overridden
                    : false,
                  note: payment.note,
                  exGratia: payment.exGratia || false,
                },
              },
            })
            resetForm()
            onClose()
          }}
          validationSchema={paymentConfirmValidationSchema(payment.amount)}
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
