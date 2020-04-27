import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Checkbox,
  Typography,
} from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import CallSplitIcon from '@material-ui/icons/CallSplit'
import * as React from 'react'
import { SelectedItemCategory } from './SelectItemCategories'

export const AddItemCategoryDialog: React.FC<{
  setDialogIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  suggestion: string
  selectedItemCategories: SelectedItemCategory[]
}> = ({ setDialogIsOpen, suggestion, selectedItemCategories }) => {
  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>New category</DialogTitle>
      <DialogContent>
        <Typography align={'center'} style={{ marginTop: '5px' }}>
          You are about to create the type
          <span style={{ fontWeight: '500' }}> {suggestion}</span>,
        </Typography>
        <Typography align={'center'} style={{ marginTop: '1px' }}>
          which will be able to append{' '}
          <span style={{ fontWeight: '500' }}> brands</span> and{' '}
          <span style={{ fontWeight: '500' }}> models</span>.
        </Typography>
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          {selectedItemCategories?.map(({ id, displayName }) => {
            return (
              <React.Fragment key={id}>
                <Chip
                  variant="outlined"
                  style={{
                    fontWeight: '500',
                    color: '#555',
                  }}
                  label={displayName}
                />
                <ArrowRightIcon
                  fontSize="small"
                  style={{
                    marginBottom: '-6px',
                    marginRight: '3px',
                    marginLeft: '3px',
                    color: '#555',
                  }}
                />
              </React.Fragment>
            )
          })}
          <Chip
            variant="outlined"
            style={{ fontWeight: '500' }}
            color="primary"
            label={suggestion}
          />
          <CallSplitIcon
            fontSize="small"
            style={{
              marginBottom: '-6px',
              marginRight: '3px',
              marginLeft: '3px',
              color: '#555',
              transform: 'rotate(90deg)',
            }}
          />
          <Chip
            variant="outlined"
            style={{
              fontWeight: '500',
              color: '#bbb',
            }}
            label={'Brands'}
          />
          <CallSplitIcon
            fontSize="small"
            style={{
              marginBottom: '-6px',
              marginRight: '3px',
              marginLeft: '3px',
              color: '#555',
              transform: 'rotate(90deg)',
            }}
          />
          <Chip
            variant="outlined"
            style={{
              fontWeight: '500',
              color: '#bbb',
            }}
            label={'Models'}
          />
        </div>
        <div style={{ paddingTop: '20px', textAlign: 'center' }}>
          <FormControlLabel
            control={<Checkbox name="checkedD" color="primary" />}
            label="This makes sense and I want to add it permanently"
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogIsOpen(false)} color="primary">
          Cancel
        </Button>
        <Button
          disabled={true}
          onClick={() => setDialogIsOpen(false)}
          color="primary"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}
