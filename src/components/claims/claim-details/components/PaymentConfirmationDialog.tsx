import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@material-ui/core'

import React, { useState } from 'react'
import { Market } from 'types/enums'

interface PaymentConfirmationDialogProps {
  onClose: () => void
  onSubmit: () => void
  amount: string
  identified: boolean
  market: string | null
}

export const PaymentConfirmationDialog: React.FC<PaymentConfirmationDialogProps> = ({
  onClose,
  onSubmit,
  amount,
  identified,
  market,
}) => {
  const [confirmValue, setConfirmValue] = useState('')

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
        <form
          onSubmit={() => {
            if (confirmValue !== amount) {
              return
            }
            onSubmit()
            setConfirmValue('')
            onClose()
          }}
        >
          <TextField
            autoFocus
            margin="dense"
            id="confirmation"
            name="confirmation"
            label="Confirmation"
            type="number"
            placeholder="Amount to be paid"
            fullWidth
            onChange={(e) => {
              setConfirmValue(e.target.value)
            }}
          />
          <DialogActions>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button
              type="submit"
              color="primary"
              disabled={confirmValue !== amount}
              variant="contained"
            >
              Confirm Payment
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}
