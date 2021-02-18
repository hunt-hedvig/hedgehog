import { Grid } from '@material-ui/core'
import { Contract } from 'api/generated/graphql'
import { Paper } from 'components/shared/Paper'
import React from 'react'
import { history } from 'store'
import { useCommandLine } from 'utils/hooks/command-line-hook'
import { KeyCode } from 'utils/hooks/key-press-hook'
import { ItemForm } from './components/ItemForm'
import { ItemList } from './components/ItemList'

export const ClaimItems: React.FC<{
  claimId: string
  memberId: string | null
  contract?: Contract | null
}> = ({ claimId, memberId, contract }) => {
  const { useAction, isHinting } = useCommandLine()

  useAction({
    label: 'Member',
    keysHint: ['⌥', 'M'],
    keys: [KeyCode.Option, KeyCode.M],
    onResolve: () => {
      if (memberId) {
        history.push(`/members/${memberId}`)
      }
    },
  })

  React.useEffect(() => {
    console.log(isHinting)
  }, [isHinting])

  return (
    <Paper>
      <Grid container spacing={24}>
        <Grid item xs={12}>
          <div>
            <h3>Inventory</h3>
          </div>
          <ItemList claimId={claimId} />
          <ItemForm claimId={claimId} memberId={memberId} contract={contract} />
        </Grid>
      </Grid>
    </Paper>
  )
}
