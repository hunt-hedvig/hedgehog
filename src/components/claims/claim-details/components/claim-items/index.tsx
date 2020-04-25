import { Grid } from '@material-ui/core'
import { Paper } from 'components/shared/Paper'
import * as React from 'react'
import {
  SelectedItemCategory,
  SelectItemCategories,
} from './SelectItemCategories'

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
            <Grid container spacing={24}>
              <Grid item xs={6}>
                <SelectItemCategories
                  selectedItemCategories={selectedItemCategories}
                  setSelectedItemCategories={setSelectedItemCategories}
                />
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Paper>
  )
}
