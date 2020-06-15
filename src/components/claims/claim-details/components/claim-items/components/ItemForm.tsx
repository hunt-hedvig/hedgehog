import { Button, Grid, MenuItem, TextField } from '@material-ui/core'
import {
  UpsertClaimItemInput,
  useUpsertClaimItemMutation,
} from 'api/generated/graphql'
import { format, isAfter, isValid, parseISO } from 'date-fns'
import { useContractMarketInfo } from 'graphql/use-get-member-contract-market-info'
import React from 'react'
import { CategorySelect, SelectedItemCategory } from './CategorySelect'
import { CurrencySelect } from './styles'

const isValidDate = (date: string) =>
  date === ''
    ? true
    : isValid(parseISO(date)) && !isAfter(parseISO(date), new Date())

export const ItemForm: React.FC<{
  claimId: string
  memberId: string | null
}> = ({ claimId, memberId }) => {
  const [selectedItemCategories, setSelectedItemCategories] = React.useState<
    SelectedItemCategory[]
  >([])

  const [purchasePrice, setPurchasePrice] = React.useState('')
  const [dateOfPurchase, setDateOfPurchase] = React.useState('')
  const [note, setNote] = React.useState('')
  const [purchasePriceCurrency, setPurchasePriceCurrency] = React.useState('')

  const [contractMarketInfo] = useContractMarketInfo(memberId ?? '')
  const validPurchasePrice = /^[0-9]*$/g.test(purchasePrice)
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
    purchasePriceAmount: purchasePrice !== '' ? Number(purchasePrice) : null,
    purchasePriceCurrency: purchasePrice !== '' ? purchasePriceCurrency : null,
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
  }, [contractMarketInfo?.preferredCurrency])

  return (
    <>
      <Grid container spacing={16}>
        <Grid item xs={6}>
          <CategorySelect
            selectedItemCategories={selectedItemCategories}
            setSelectedItemCategories={setSelectedItemCategories}
          />
        </Grid>
        <Grid item style={{ width: '16.5%' }}>
          <Grid container spacing={0}>
            <Grid item style={{ width: '50%' }}>
              <TextField
                placeholder={'Price'}
                error={!validPurchasePrice}
                value={purchasePrice}
                helperText={!validPurchasePrice && 'Only numbers'}
                onChange={({ target: { value } }) => setPurchasePrice(value)}
                fullWidth
              />
            </Grid>
            <Grid item style={{ width: '50%', marginTop: '-1px' }}>
              <CurrencySelect
                error={!validPurchasePrice}
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
              </CurrencySelect>
            </Grid>
          </Grid>
        </Grid>
        <Grid item style={{ width: '13.0%' }}>
          <TextField
            value={dateOfPurchase}
            error={!isValidDate(dateOfPurchase)}
            helperText={!isValidDate(dateOfPurchase) && 'Invalid date'}
            onChange={({ target: { value } }) => setDateOfPurchase(value)}
            onBlur={() => {
              !isValidDate(dateOfPurchase)
                ? setDateOfPurchase('')
                : setDateOfPurchase(
                    format(parseISO(dateOfPurchase), 'yyyy-MM-dd'),
                  )
            }}
            placeholder="Purchase date"
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
