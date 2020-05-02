import { Button, Grid, TextField } from '@material-ui/core'
import { Paper } from 'components/shared/Paper'
import * as React from 'react'
import {
  SelectedItemCategory,
  SelectItemCategories,
} from './components/SelectItemCategories'

export const ClaimItems: React.FC<{ claimId: string }> = ({ claimId }) => {
  const [selectedItemCategories, setSelectedItemCategories] = React.useState<
    SelectedItemCategory[]
  >([])

  return (
    <Paper>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <div>
            <h3>Inventory</h3>
          </div>

          <form onSubmit={(e) => e.preventDefault()}>
            <Grid container spacing={16}>
              <Grid style={{ marginTop: '16px' }} item xs={6}>
                <SelectItemCategories
                  selectedItemCategories={selectedItemCategories}
                  setSelectedItemCategories={setSelectedItemCategories}
                />
              </Grid>
              <Grid item xs={'auto'}>
                <TextField label={'Purchase price'} fullWidth />
              </Grid>
              <Grid item xs={'auto'}>
                <TextField label={'Date of purchase'} fullWidth />
              </Grid>
              <Grid item xs={true}>
                <TextField label={'Note'} fullWidth />
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
