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
import { useContractMarketInfo } from 'graphql/use-get-member-contract-market-info'
import moment from 'moment'
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

const isValidDate = (date: string) =>
  date === ''
    ? true
    : moment(date, 'YYYY-MM-DD', true).isValid() &&
      !moment(date, 'YYYY-MM-DD', true).isAfter(moment())

export const NewItemForm: React.FC<{
  claimId: string
  memberId: string | null
}> = ({ claimId, memberId }) => {
  const [selectedItemCategories, setSelectedItemCategories] = React.useState<
    SelectedItemCategory[]
  >([])

  const [purchasePrice, setPurchasePrice] = React.useState<string>('')
  const [dateOfPurchase, setDateOfPurchase] = React.useState<string>('')
  const [note, setNote] = React.useState<string>('')
  const [purchasePriceCurrency, setPurchasePriceCurrency] = React.useState<
    string
  >('')

  const [contractMarketInfo] = useContractMarketInfo(memberId ?? '')
  const validPurchasePrice = purchasePrice.match(/^[0-9]*$/g)
  const defaultCurrency = contractMarketInfo?.preferredCurrency ?? 'SEK'

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
    note: note === '' ? null : note,
  }

  const formLooksGood =
    addNewClaimItemRequest.itemFamilyId &&
    addNewClaimItemRequest.itemTypeId &&
    validPurchasePrice &&
    isValidDate(dateOfPurchase)

  const resetForm = () => {
    setPurchasePrice('')
    setPurchasePriceCurrency(defaultCurrency)
    setDateOfPurchase('')
    setSelectedItemCategories([])
    setNote('')
  }

  React.useEffect(() => {
    setPurchasePriceCurrency(defaultCurrency)
  }, [contractMarketInfo])

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
                onChange={({ target: { value } }) => setPurchasePrice(value)}
                fullWidth
              />
            </Grid>
            <Grid item style={{ width: '40%', marginTop: '-1px' }}>
              <Select
                error={!validPurchasePrice}
                style={{ color: '#888', textAlign: 'right' }}
                value={purchasePriceCurrency}
                onChange={({ target: { value } }) =>
                  setPurchasePriceCurrency(value)
                }
              >
                <MenuItem value={'SEK'}>SEK</MenuItem>
                <MenuItem value={'NOK'}>NOK</MenuItem>
                <MenuItem value={'EUR'}>EUR</MenuItem>
                <MenuItem value={'USD'}>USD</MenuItem>
                <MenuItem value={'GBP'}>GBP</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Grid item style={{ width: '13.0%' }}>
          <TextField
            value={dateOfPurchase}
            error={!isValidDate(dateOfPurchase)}
            helperText={!isValidDate(dateOfPurchase) && 'Invalid date'}
            onChange={({ target: { value } }) => setDateOfPurchase(value)}
            onBlur={() => !isValidDate(dateOfPurchase) && setDateOfPurchase('')}
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
            onChange={({ target: { value } }) => setNote(value)}
            placeholder={'Note (optional)'}
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
