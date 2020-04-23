import { Grid, Paper } from '@material-ui/core'
import { ItemCategoryKind } from 'api/generated/graphql'
import { useGetItemCategories } from 'graphql/use-get-item-categories'
import { Button } from 'hedvig-ui/button'
import * as React from 'react'

interface CurrentItemCategory {
  kind: ItemCategoryKind
  parentId: string | null
}

export const ClaimItems: React.FC<{ claimId: string }> = ({ claimId }) => {
  const [currentItemCategory, setCurrentItemCategory] = React.useState<
    CurrentItemCategory
  >({
    kind: ItemCategoryKind.Family,
    parentId: null,
  })

  const [newItemCategories] = useGetItemCategories(
    currentItemCategory.kind,
    currentItemCategory.parentId,
  )

  return (
    <Paper>
      <Grid container spacing={24}>
        <div>
          {newItemCategories.map((itemCategory) => (
            <Button
              onClick={() => {
                if (itemCategory.nextKind != null) {
                  setCurrentItemCategory({
                    kind: itemCategory.nextKind,
                    parentId: itemCategory.id,
                  })
                }
              }}
            >
              {itemCategory.displayName}
            </Button>
          ))}
        </div>
      </Grid>
    </Paper>
  )
}
