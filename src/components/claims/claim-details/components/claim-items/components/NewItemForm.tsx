import {
  Button,
  Grid,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
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

  const validPurchasePrice = purchasePrice.match(/^[0-9]*$/g)

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
    purchasePriceAmount:
      purchasePrice !== ('0' && '') ? Number(purchasePrice) : null,
    purchasePriceCurrency:
      purchasePrice !== ('0' && '') ? purchasePriceCurrency : null,
    dateOfLoss: format(new Date(), 'yyyy-MM-dd'),
    note: note === '' ? null : note,
  }

  const formLooksGood =
    addNewClaimItemRequest.itemFamilyId &&
    addNewClaimItemRequest.itemTypeId &&
    validPurchasePrice

  const resetForm = () => {
    setPurchasePrice('')
    setPurchasePriceCurrency('SEK')
    setDateOfPurchase('')
    setSelectedItemCategories([])
    setNote('')
  }

  return (
    <>
      <Grid container spacing={16}>
        <Grid item xs={6}>
          <SelectItemCategories
            selectedItemCategories={selectedItemCategories}
            setSelectedItemCategories={setSelectedItemCategories}
          />
        </Grid>
        <Grid item style={{ width: '16.5%' }}>
          <Grid container spacing={0}>
            <Grid item style={{ width: '60%' }}>
              <TextField
                placeholder={'Purchase price'}
                error={!validPurchasePrice}
                value={purchasePrice}
                helperText={!validPurchasePrice && 'Only numbers'}
                onChange={(e) => setPurchasePrice(e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item style={{ width: '40%', marginTop: '-1px' }}>
              <Select
                error={!validPurchasePrice}
                style={{ color: '#888', textAlign: 'right' }}
                value={purchasePriceCurrency}
                onChange={(e) => setPurchasePriceCurrency(e.target.value)}
              >
                <MenuItem value={'SEK'}>SEK</MenuItem>
                <MenuItem value={'NOK'}>NOK</MenuItem>
              </Select>
            </Grid>
          </Grid>
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
