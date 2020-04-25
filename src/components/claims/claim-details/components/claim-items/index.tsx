import { Grid } from '@material-ui/core'
import { Paper } from 'components/shared/Paper'
import * as React from 'react'
import { SelectItemCategories } from './SelectItemCategories'

export const ClaimItems: React.FC<{ claimId: string }> = ({ claimId }) => {
  return (
    <Paper>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <div>
            <h3>Inventory</h3>
          </div>

          <form>
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <SelectItemCategories />
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Paper>
  )
}
