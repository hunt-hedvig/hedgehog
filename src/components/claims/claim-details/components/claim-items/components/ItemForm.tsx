import { Button, Grid, MenuItem, TextField } from '@material-ui/core'
import {
  UpsertClaimItemInput,
  useUpsertClaimItemMutation,
} from 'api/generated/graphql'
import { format, isAfter, isValid, parseISO } from 'date-fns'
import { useContractMarketInfo } from 'graphql/use-get-member-contract-market-info'
import React from 'react'
import { CategorySelect, SelectedItemCategory } from './CategorySelect'
import { MessageChip } from './MessageChip'

const isValidDate = (date: string) =>
  date === ''
    ? true
    : isValid(parseISO(date)) && !isAfter(parseISO(date), new Date())

const isNotValidDate = (date: string) => !isValidDate(date)
const isValidNumber = (n: string) => /^[0-9]*$/g.test(n)
const isNotValidNumber = (n: string) => !isValidNumber(n)
const isNotEmpty = (s: string | null) => s !== '' && s !== null
const isEmpty = (s: string | null) => !isNotEmpty(s)

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
  const [autoValuation, setAutoValuation] = React.useState<string | null>('')
  const [customValuation, setCustomValuation] = React.useState('')
  const [contractMarketInfo] = useContractMarketInfo(memberId ?? '')
  const defaultCurrency = contractMarketInfo?.preferredCurrency ?? 'SEK'

  const [
    upsertClaimItem,
    { loading: loadingUpsertClaimItem },
  ] = useUpsertClaimItemMutation()

  const formData: UpsertClaimItemInput = {
    claimId,
    itemFamilyId: selectedItemCategories[0]?.id ?? null,
    itemTypeId: selectedItemCategories[1]?.id ?? null,
    itemBrandId: selectedItemCategories[2]?.id ?? null,
    itemModelId: selectedItemCategories[3]?.id ?? null,
    dateOfPurchase:
      dateOfPurchase !== '' && dateOfPurchase.length === 10
        ? dateOfPurchase
        : null,
    purchasePriceAmount: isNotEmpty(purchasePrice)
      ? Number(purchasePrice)
      : null,
    purchasePriceCurrency: isNotEmpty(purchasePrice)
      ? purchasePriceCurrency
      : null,
    valuationAmount: Number(autoValuation) ?? null,
    customValuationAmount:
      isNotEmpty(customValuation) && isValidNumber(customValuation)
        ? Number(customValuation)
        : null,
    valuationCurrency:
      isNotEmpty(customValuation) || isNotEmpty(autoValuation)
        ? purchasePriceCurrency
        : null,
    note: note === '' ? null : note,
  }

  const formLooksGood =
    formData.itemFamilyId &&
    formData.itemTypeId &&
    isValidNumber(purchasePrice) &&
    isValidDate(dateOfPurchase) &&
    isValidNumber(customValuation)

  const resetForm = () => {
    setPurchasePrice('')
    setPurchasePriceCurrency(defaultCurrency)
    setDateOfPurchase('')
    setSelectedItemCategories([])
    setNote('')
    setCustomValuation('')
    setAutoValuation(null)
  }

  React.useEffect(() => {
    setPurchasePriceCurrency(defaultCurrency)
  }, [contractMarketInfo?.preferredCurrency])

  return (
    <>
      <Grid container spacing={8}>
        <Grid item xs={6}>
          <CategorySelect
            selectedItemCategories={selectedItemCategories}
            setSelectedItemCategories={setSelectedItemCategories}
          />
        </Grid>
        <Grid item xs={1}>
          <TextField
            placeholder="Price"
            error={isNotValidNumber(purchasePrice)}
            value={purchasePrice}
            helperText={isNotValidNumber(purchasePrice) && 'Only numbers'}
            onChange={({ target: { value } }) => setPurchasePrice(value)}
            fullWidth
            inputProps={{
              style: {
                paddingLeft: '10px',
              },
            }}
          />
        </Grid>
        <Grid item xs={1}>
          <TextField
            select
            error={isNotValidNumber(purchasePrice)}
            value={purchasePriceCurrency}
            onChange={({ target: { value } }) =>
              setPurchasePriceCurrency(value)
            }
            fullWidth
          >
            <MenuItem value="SEK">SEK</MenuItem>
            <MenuItem value="NOK">NOK</MenuItem>
            <MenuItem value="EUR">EUR</MenuItem>
            <MenuItem value="USD">USD</MenuItem>
            <MenuItem value="GBP">GBP</MenuItem>
          </TextField>
        </Grid>
        <Grid item>
          <TextField
            value={dateOfPurchase}
            error={isNotValidDate(dateOfPurchase)}
            helperText={isNotValidDate(dateOfPurchase) && 'Invalid date'}
            onChange={({ target: { value } }) => setDateOfPurchase(value)}
            onBlur={() =>
              isEmpty(dateOfPurchase) || isNotValidDate(dateOfPurchase)
                ? setDateOfPurchase('')
                : setDateOfPurchase(
                    format(parseISO(dateOfPurchase), 'yyyy-MM-dd'),
                  )
            }
            placeholder="Purchase date"
            inputProps={{
              style: {
                paddingLeft: '10px',
                paddingRight: '10px',
              },
            }}
          />
        </Grid>
        <Grid item xs={true}>
          <TextField
            value={note}
            onChange={({ target: { value } }) => setNote(value)}
            placeholder="Note (optional)"
            fullWidth
            helperText=" "
            inputProps={{
              style: {
                paddingLeft: '10px',
              },
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={16}>
        <Grid item style={{ width: '79.5%' }}>
          <MessageChip
            formData={formData}
            setAutoValuation={setAutoValuation}
            customValuation={customValuation}
            setCustomValuation={setCustomValuation}
            defaultCurrency={defaultCurrency}
          />
        </Grid>

        <Grid item xs={true}>
          <Button
            disabled={!formLooksGood || loadingUpsertClaimItem}
            fullWidth
            variant="contained"
            color="primary"
            onClick={() =>
              upsertClaimItem({
                variables: { request: formData },
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
