import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from '@material-ui/core'
import * as React from 'react'

export const AddItemCategoryDialog: React.FC<{
  setDialogIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}> = ({ setDialogIsOpen }) => {
  return (
    <Dialog aria-labelledby="customized-dialog-title" open={true}>
      <DialogTitle id="customized-dialog-title">Modal title</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Cras mattis consectetur purus sit amet fermentum. Cras justo odio,
          dapibus ac facilisis in, egestas eget quam. Morbi leo risus, porta ac
          consectetur ac, vestibulum at eros.
        </Typography>
        <Typography gutterBottom>
          Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
          Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.
        </Typography>
        <Typography gutterBottom>
          Aenean lacinia bibendum nulla sed consectetur. Praesent commodo cursus
          magna, vel scelerisque nisl consectetur et. Donec sed odio dui. Donec
          ullamcorper nulla non metus auctor fringilla.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => setDialogIsOpen(false)}
          color="primary"
        >
          Save changes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
