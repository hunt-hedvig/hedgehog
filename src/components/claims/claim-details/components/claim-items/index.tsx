import { Grid } from '@material-ui/core'
import { useClaimPageQuery } from 'api/generated/graphql'
import { CardContent } from 'hedvig-ui/card'
import React from 'react'
import { ItemForm } from './components/ItemForm'
import { ItemList } from './components/ItemList'

export const ClaimItems: React.FC<{
  claimId: string
  memberId: string | null
}> = ({ claimId, memberId }) => {
  const { data: contractData } = useClaimPageQuery({
    variables: { claimId },
  })
  const contract = contractData?.claim?.contract

  return (
    <CardContent>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <div>
            <h3>Inventory</h3>
          </div>
          <ItemList claimId={claimId} />
          {contract && (
            <ItemForm
              claimId={claimId}
              memberId={memberId}
              contract={contract}
            />
          )}
        </Grid>
      </Grid>
    </CardContent>
  )
}
