import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  TextField,
  Typography,
} from '@material-ui/core'
import {
  ItemCategoryKind,
  useUpsertItemBrandMutation,
  useUpsertItemCompanyMutation,
  useUpsertItemModelMutation,
  useUpsertItemTypeMutation,
} from 'api/generated/graphql'
import { useGetItemCategories } from 'graphql/use-get-item-categories'
import {
  useUpsertItemBrandOptions,
  useUpsertItemCompanyOptions,
  useUpsertItemModelOptions,
  useUpsertItemTypeOptions,
} from 'graphql/use-upsert-item-category'
import * as React from 'react'
import { ItemCategoryChain } from './ItemCategoryChain'
import { SelectedItemCategory } from './SelectItemCategories'

export const AddItemCategoryDialog: React.FC<{
  setDialogIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  suggestion: string
  selectedItemCategories: SelectedItemCategory[]
}> = ({ setDialogIsOpen, suggestion, selectedItemCategories }) => {
  const parentItemCategory = selectedItemCategories.slice(-1)[0]
  const proposedKind = parentItemCategory?.nextKind

  const [itemCompanies] = useGetItemCategories(ItemCategoryKind.Company, null)
  const [hasVerified, setHasVerified] = React.useState<boolean>(false)
  const [itemCompanyId, setItemCompanyId] = React.useState<string>('')
  const typeIsBrandButNoCompanyChosen =
    proposedKind === ItemCategoryKind.Brand && itemCompanyId === ''

  const [upsertItemType] = useUpsertItemTypeMutation()
  const [upsertItemBrand] = useUpsertItemBrandMutation()
  const [upsertItemModel] = useUpsertItemModelMutation()
  const [upsertItemCompany] = useUpsertItemCompanyMutation()

  return (
    <Dialog
      disableBackdropClick
      disableEscapeKeyDown
      open
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>New {proposedKind.toString().toLowerCase()}</DialogTitle>
      <DialogContent>
        <ItemCategoryChain
          suggestion={suggestion}
          selectedItemCategories={selectedItemCategories}
        />

        {proposedKind === ItemCategoryKind.Brand && (
          <>
            <Typography align={'center'} style={{ marginTop: '30px' }}>
              Please select a <span style={{ fontWeight: 500 }}>company</span>{' '}
              associated with{' '}
              <span style={{ fontWeight: 500 }}>{suggestion}</span>
            </Typography>
            <div style={{ paddingTop: '10px', textAlign: 'center' }}>
              <TextField
                select
                style={{ width: '40%', textAlign: 'left' }}
                onChange={(option) => setItemCompanyId(option.target.value)}
                value={itemCompanyId as string}
              >
                {itemCompanies.map((company) => (
                  <MenuItem key={company.id} value={company.id}>
                    {company.displayName}
                  </MenuItem>
                ))}
              </TextField>
            </div>
          </>
        )}

        <div style={{ paddingTop: '20px', textAlign: 'center' }}>
          <FormControlLabel
            control={<Checkbox name="checkedD" color="primary" />}
            label="This makes sense and I want to add it permanently"
            checked={hasVerified}
            onChange={() => setHasVerified((verified) => !verified)}
          />
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDialogIsOpen(false)} color="primary">
          Cancel
        </Button>
        <Button
          disabled={typeIsBrandButNoCompanyChosen || !hasVerified}
          onClick={() => {
            switch (proposedKind) {
              case ItemCategoryKind.Type:
                return upsertItemType(
                  useUpsertItemTypeOptions(suggestion, parentItemCategory.id),
                ).then(() => setDialogIsOpen(false))
              case ItemCategoryKind.Brand:
                return upsertItemBrand(
                  useUpsertItemBrandOptions(
                    suggestion,
                    parentItemCategory.id,
                    itemCompanyId,
                  ),
                ).then(() => setDialogIsOpen(false))
              case ItemCategoryKind.Model:
                return upsertItemModel(
                  useUpsertItemModelOptions(suggestion, parentItemCategory.id),
                ).then(() => setDialogIsOpen(false))
              case ItemCategoryKind.Company:
                return upsertItemCompany(
                  useUpsertItemCompanyOptions(suggestion),
                ).then()
            }
          }}
          color="primary"
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}
