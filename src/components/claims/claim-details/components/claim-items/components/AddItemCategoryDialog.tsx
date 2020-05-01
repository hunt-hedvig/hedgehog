import {
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
} from '@material-ui/core'
import {
  ItemCategoryKind,
  useUpsertItemBrandMutation,
  useUpsertItemModelMutation,
  useUpsertItemTypeMutation,
} from 'api/generated/graphql'
import {
  useUpsertItemBrandOptions,
  useUpsertItemModelOptions,
  useUpsertItemTypeOptions,
} from 'graphql/use-upsert-item-category'
import * as React from 'react'
import { ItemCategoryChain } from './ItemCategoryChain'
import { SelectedItemCategory } from './SelectItemCategories'
import { SelectItemCompany } from './SelectItemCompany'

export interface ItemCompanySelection {
  value: string
  label: string
}

export const AddItemCategoryDialog: React.FC<{
  setDialogIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  suggestion: string
  selectedItemCategories: SelectedItemCategory[]
}> = ({ setDialogIsOpen, suggestion, selectedItemCategories }) => {
  const parentItemCategory = selectedItemCategories.slice(-1)[0]
  const proposedKind = parentItemCategory?.nextKind

  const [hasVerified, setHasVerified] = React.useState<boolean>(false)
  const [
    itemCompany,
    setItemCompany,
  ] = React.useState<ItemCompanySelection | null>(null)
  const typeIsBrandButNoCompanyChosen =
    proposedKind === ItemCategoryKind.Brand && !!itemCompany?.value

  const [upsertItemType] = useUpsertItemTypeMutation()
  const [upsertItemBrand] = useUpsertItemBrandMutation()
  const [upsertItemModel] = useUpsertItemModelMutation()

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
          <SelectItemCompany
            itemCompany={itemCompany}
            setItemCompany={setItemCompany}
          />
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
                return (
                  itemCompany &&
                  upsertItemBrand(
                    useUpsertItemBrandOptions(
                      suggestion,
                      parentItemCategory.id,
                      itemCompany.value,
                    ),
                  ).then(() => setDialogIsOpen(false))
                )
              case ItemCategoryKind.Model:
                return upsertItemModel(
                  useUpsertItemModelOptions(suggestion, parentItemCategory.id),
                ).then(() => setDialogIsOpen(false))
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
