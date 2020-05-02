import {
  Button,
  Fade,
  Grid,
  TextField,
  Typography,
  withStyles,
} from '@material-ui/core'
import { Paper } from 'components/shared/Paper'
import { Money } from 'lib/intl'
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

  const [purchasePrice, setPurchasePrice] = React.useState<Money | null>(null)

  return (
    <Paper>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <div>
            <h3>Inventory</h3>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <Grid
              container
              style={{ marginBottom: '-18px', marginTop: '10px' }}
              spacing={16}
            >
              <Grid item xs={6}>
                <TableHeader>Item</TableHeader>
              </Grid>
              <Grid item style={{ width: '14.7%' }}>
                <Fade in={selectedItemCategories.length !== 0}>
                  <TableHeader>Purchase price</TableHeader>
                </Fade>
              </Grid>
              <Grid item style={{ width: '14.7%' }}>
                <TableHeader>Date of purchase</TableHeader>
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
              <Grid item style={{ width: '14.7%' }}>
                <TextField
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(e.target.value)}
                  placeholder={'Purchase price'}
                  fullWidth
                />
              </Grid>
              <Grid item style={{ width: '14.7%' }}>
                <TextField placeholder={'Date of purchase'} fullWidth />
              </Grid>
              <Grid item xs={true}>
                <TextField placeholder={'Note'} fullWidth />
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
          </form>
        </Grid>
      </Grid>
    </Paper>
  )
}
