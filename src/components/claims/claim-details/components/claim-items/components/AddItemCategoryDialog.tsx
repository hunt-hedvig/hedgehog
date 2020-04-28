import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from '@material-ui/core'
import * as React from 'react'
import { ItemCategoryChain } from './ItemCategoryChain'
import { SelectedItemCategory } from './SelectItemCategories'

export const AddItemCategoryDialog: React.FC<{
  setDialogIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  suggestion: string
  selectedItemCategories: SelectedItemCategory[]
}> = ({ setDialogIsOpen, suggestion, selectedItemCategories }) => {
  const proposedKind = selectedItemCategories
    .slice(-1)[0]
    ?.nextKind.toLowerCase()

  const [hasVerified, setHasVerified] = React.useState<boolean>(false)
  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>New {proposedKind}</DialogTitle>
      <DialogContent>
        <ItemCategoryChain
          suggestion={suggestion}
          selectedItemCategories={selectedItemCategories}
        />

        <div style={{ paddingTop: '20px', textAlign: 'center' }}>
          <FormControlLabel
            control={<Checkbox name="checkedD" color="primary" />}
            label="This makes sense and I want to add it permanently"
            checked={hasVerified}
            onChange={() => setHasVerified((verified) => !verified)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogIsOpen(false)} color="primary">
          Cancel
        </Button>
        <Button
          disabled={!hasVerified}
          onClick={() => setDialogIsOpen(false)}
          color="primary"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}
