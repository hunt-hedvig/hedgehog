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
import { Paper } from 'components/shared/Paper'
import format from 'date-fns/format'
import { DatePicker } from 'material-ui-pickers'
import * as React from 'react'
import {
  SelectedItemCategory,
  SelectItemCategories,
} from './components/SelectItemCategories'

export const TableHeader = withStyles({
  root: {
    fontSize: '0.7rem',
    color: '#333',
  },
})(Typography)

export const ClaimItems: React.FC<{ claimId: string }> = ({ claimId }) => {
  const [selectedItemCategories, setSelectedItemCategories] = React.useState<
    SelectedItemCategory[]
  >([])

  const [purchasePrice, setPurchasePrice] = React.useState<string>('')
  const [dateOfPurchase, setDateOfPurchase] = React.useState<string>('')
  const [purchasePriceCurrency, setPurchasePriceCurrency] = React.useState<
    string
  >('SEK')
  const [dateOfPurchaseActive, setDateOfPurchaseActive] = React.useState<
    boolean
  >(false)

  const validPurchasePrice = !purchasePrice.match(/^[0-9]*$/g)

  return (
    <Paper>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <div>
            <h3>Inventory</h3>
          </div>

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
              <TableHeader>Note</TableHeader>
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
                        onChange={(e) =>
                          setPurchasePriceCurrency(e.target.value)
                        }
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
                labelFunc={(date: Date) =>
                  date ? format(date, 'yyyy-MM-dd') : ''
                }
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
                      <TodayIcon
                        style={{ fontSize: '1.2rem', color: '#555' }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={true}>
              <TextField placeholder={'Note'} fullWidth helperText={' '} />
            </Grid>
          </Grid>
          <Grid container spacing={16}>
            <Grid item style={{ width: '79.5%' }} />
            <Grid item xs={true}>
              <Button fullWidth variant="contained" color="primary">
                Add item
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
  )
}
