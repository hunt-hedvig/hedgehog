import {
  Button,
  Fade,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
  withStyles,
} from '@material-ui/core'
import TodayIcon from '@material-ui/icons/Today'
import {
  UpsertClaimItemInput,
  useUpsertClaimItemMutation,
} from 'api/generated/graphql'
import format from 'date-fns/format'
import { DatePicker } from 'material-ui-pickers'
import * as React from 'react'
import {
  SelectedItemCategory,
  SelectItemCategories,
} from './SelectItemCategories'

const TableHeader = withStyles({
  root: {
    fontSize: '0.7rem',
    color: '#333',
  },
})(Typography)

const DateIcon = withStyles({
  root: {
    fontSize: '1.2rem',
    color: '#555',
  },
})(TodayIcon)

export const NewItemForm: React.FC<{ claimId: string }> = ({ claimId }) => {
  const [selectedItemCategories, setSelectedItemCategories] = React.useState<
    SelectedItemCategory[]
  >([])

  const [purchasePrice, setPurchasePrice] = React.useState<string>('')
  const [dateOfPurchase, setDateOfPurchase] = React.useState<string>('')
  const [note, setNote] = React.useState<string>('')
  const [purchasePriceCurrency, setPurchasePriceCurrency] = React.useState<
    string
  >('SEK')
  const [dateOfPurchaseActive, setDateOfPurchaseActive] = React.useState<
    boolean
  >(false)

  const validPurchasePrice = !purchasePrice.match(/^[0-9]*$/g)

  const [
    upsertClaimItem,
    { loading: loadingUpsertClaimItem },
  ] = useUpsertClaimItemMutation()

  const addNewClaimItemRequest: UpsertClaimItemInput = {
    claimId,
    itemFamilyId: selectedItemCategories[0]?.id ?? null,
    itemTypeId: selectedItemCategories[1]?.id ?? null,
    itemBrandId: selectedItemCategories[2]?.id ?? null,
    itemModelId: selectedItemCategories[3]?.id ?? null,
    dateOfPurchase: dateOfPurchase === '' ? null : dateOfPurchase,
    purchasePrice:
      purchasePrice === ''
        ? null
        : { amount: purchasePrice, currency: purchasePriceCurrency },
    dateOfLoss: '2001-01-01',
    note: note === '' ? null : note,
  }

  const formLooksGood =
    addNewClaimItemRequest.itemFamilyId && addNewClaimItemRequest.itemTypeId

  const resetForm = () => {
    setPurchasePrice('')
    setPurchasePriceCurrency('SEK')
    setDateOfPurchase('')
    setSelectedItemCategories([])
    setNote('')
  }

  return (
    <>
      <Grid
        container
        style={{ marginBottom: '-18px', marginTop: '10px' }}
        spacing={16}
      >
        <Grid item xs={6}>
          <TableHeader>Item</TableHeader>
        </Grid>
        <Grid item style={{ width: '16.5%' }}>
          <Fade in={purchasePrice !== ''}>
            <TableHeader>Purchase price</TableHeader>
          </Fade>
        </Grid>
        <Grid item style={{ width: '13.0%' }}>
          <Fade in={dateOfPurchase !== '' || dateOfPurchaseActive}>
            <TableHeader>Purchase date</TableHeader>
          </Fade>
        </Grid>
        <Grid item xs={true}>
          <Fade in={note !== ''}>
            <TableHeader>Note</TableHeader>
          </Fade>
        </Grid>
      </Grid>
      <Grid container spacing={16}>
        <Grid item xs={6}>
          <SelectItemCategories
            selectedItemCategories={selectedItemCategories}
            setSelectedItemCategories={setSelectedItemCategories}
          />
        </Grid>
        <Grid item style={{ width: '16.5%' }}>
          <TextField
            placeholder={'Purchase price'}
            error={!!validPurchasePrice}
            helperText={!!validPurchasePrice && 'Price should be a number'}
            onChange={(e) => setPurchasePrice(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Select
                    style={{ color: '#888' }}
                    disableUnderline
                    value={purchasePriceCurrency}
                    onChange={(e) => setPurchasePriceCurrency(e.target.value)}
                  >
                    <MenuItem value={'SEK'}>SEK</MenuItem>
                    <MenuItem value={'NOK'}>NOK</MenuItem>
                  </Select>
                </InputAdornment>
              ),
            }}
            fullWidth
          />
        </Grid>
        <Grid item style={{ width: '13.0%' }}>
          <DatePicker
            keyboard
            minDateMessage={'Invalid Date'}
            maxDateMessage={'Invalid Date'}
            format={'yyyy-MM-dd'}
            labelFunc={(date: Date) => (date ? format(date, 'yyyy-MM-dd') : '')}
            fullWidth
            autoOk
            onFocus={() => setDateOfPurchaseActive(true)}
            onBlur={() => setDateOfPurchaseActive(false)}
            value={dateOfPurchase === '' ? null : dateOfPurchase}
            onChange={(date: Date) => {
              date
                ? setDateOfPurchase(format(date, 'yyyy-MM-dd'))
                : setDateOfPurchase('')
            }}
            placeholder="Purchase date"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <DateIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid item xs={true}>
          <TextField
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={'Note'}
            fullWidth
            helperText={' '}
          />
        </Grid>
      </Grid>
      <Grid container spacing={16}>
        <Grid item style={{ width: '79.5%' }} />
        <Grid item xs={true}>
          <Button
            disabled={!formLooksGood || loadingUpsertClaimItem}
            fullWidth
            variant="contained"
            color="primary"
            onClick={() =>
              upsertClaimItem({
                variables: { request: addNewClaimItemRequest },
                refetchQueries: ['GetClaimItems'],
              }).then(() => resetForm())
            }
          >
            Add item
          </Button>
        </Grid>
      </Grid>
    </>
  )
}
