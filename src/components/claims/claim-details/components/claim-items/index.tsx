import { Grid } from '@material-ui/core'
import { Paper } from 'components/shared/Paper'
import * as React from 'react'
import { ItemForm } from './components/ItemForm'
import { ItemList } from './components/ItemList'

export const ClaimItems: React.FC<{
  claimId: string
  memberId: string | null
}> = ({ claimId, memberId }) => {
  return (
    <Paper>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <div>
            <h3>Inventory</h3>
          </div>
          <ItemList claimId={claimId} />
          <ItemForm claimId={claimId} memberId={memberId} />
        </Grid>
      </Grid>
    </Paper>
  )
}
