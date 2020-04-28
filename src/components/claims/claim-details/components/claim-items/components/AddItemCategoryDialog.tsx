import {
  Button,
  Checkbox,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Typography,
  withStyles,
} from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import CallSplitIcon from '@material-ui/icons/CallSplit'
import * as React from 'react'
import { ItemCategoryKind } from '../../../../../../api/generated/graphql'
import { SelectedItemCategory } from './SelectItemCategories'

const PreviousChip = withStyles({
  root: {
    fontWeight: 500,
    color: '#555',
  },
})(Chip)

const CurrentChip = withStyles({
  root: {
    fontWeight: 500,
  },
})(Chip)

const UpcomingChip = withStyles({
  root: {
    fontWeight: 500,
    color: '#bbb',
  },
})(Chip)

const MultipleArrowsRight = withStyles({
  root: {
    marginBottom: '-6px',
    marginRight: '3px',
    marginLeft: '3px',
    color: '#555',
    transform: 'rotate(90deg)',
    fontSize: 'medium',
  },
})(CallSplitIcon)

const SmallArrowRight = withStyles({
  root: {
    marginBottom: '-5px',
    marginRight: '3px',
    marginLeft: '3px',
    color: '#555',
    fontSize: 'medium',
  },
})(ArrowRightIcon)

const getTypeInfoSentence = (remainingTypes: string[]) => {
  if (remainingTypes.length === 0) {
    return <></>
  }

  if (remainingTypes.length === 1) {
    return (
      <>
        which will be able to append
        <span style={{ fontWeight: 500 }}>{' ' + remainingTypes[0]}s</span>.
      </>
    )
  }

  return (
    <>
      which will be able to append
      <span style={{ fontWeight: 500 }}>
        {remainingTypes.slice(0, -1).map((type, iteration) => {
          if (iteration === 0) {
            return ' ' + type + 's'
          } else {
            return ', ' + type + 's'
          }
        })}
      </span>
      {' and '}
      <span style={{ fontWeight: 500 }}>{remainingTypes.slice(-1) + 's.'}</span>
    </>
  )
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const ItemCategoryChain: React.FC<{
  suggestion: string
  selectedItemCategories: SelectedItemCategory[]
}> = ({ suggestion, selectedItemCategories }) => {
  const excludedTypes: string[] = ['family', 'company']
  const availableTypes: string[] = Object.keys(ItemCategoryKind).map((kind) =>
    kind.toLowerCase(),
  )
  const selectedTypes: string[] = selectedItemCategories.map(({ nextKind }) =>
    nextKind.toLowerCase(),
  )
  const remainingTypes: string[] = availableTypes
    .filter((type) => !selectedTypes.includes(type))
    .filter((type) => !excludedTypes.includes(type))

  const currentType: string[] = selectedTypes.splice(-1)
  const existsMoreTypes: boolean = remainingTypes.length > 0

  return (
    <>
      <Typography align={'center'} style={{ marginTop: '5px' }}>
        You are about to create the {currentType}{' '}
        <span style={{ fontWeight: 500 }}>{suggestion}</span>
        {!existsMoreTypes && '.'}
      </Typography>
      <Typography align={'center'} style={{ marginTop: '1px' }}>
        {existsMoreTypes && getTypeInfoSentence(remainingTypes)}
      </Typography>
      <div style={{ textAlign: 'center', marginTop: '30px' }}>
        {selectedItemCategories?.map(({ id, displayName }) => {
          return (
            <React.Fragment key={id}>
              <PreviousChip variant="outlined" label={displayName} />
              <SmallArrowRight />
            </React.Fragment>
          )
        })}
        <CurrentChip variant="outlined" color="primary" label={suggestion} />
        {remainingTypes.map((type) => {
          return (
            <>
              <MultipleArrowsRight />
              <UpcomingChip variant="outlined" label={capitalize(type) + 's'} />
            </>
          )
        })}
      </div>
      <div style={{ paddingTop: '20px', textAlign: 'center' }}>
        <FormControlLabel
          control={<Checkbox name="checkedD" color="primary" />}
          label="This makes sense and I want to add it permanently"
        />
      </div>
    </>
  )
}

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
        <ItemCategoryChain
          suggestion={suggestion}
          selectedItemCategories={selectedItemCategories}
        />
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
