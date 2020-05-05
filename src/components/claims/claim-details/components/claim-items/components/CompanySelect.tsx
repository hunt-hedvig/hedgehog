import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from '@material-ui/core'
import {
  ItemCategoryKind,
  useUpsertItemCompanyMutation,
} from 'api/generated/graphql'
import { useGetItemCategories } from 'graphql/use-get-item-categories'
import { useUpsertItemCompanyOptions } from 'graphql/use-upsert-item-category'
import * as React from 'react'
import CreatableSelect from 'react-select/creatable'
import { ItemCompanySelection } from './CategoryDialog'
import { categorySelectStyle } from './styles'

export const CompanySelect: React.FC<{
  itemCompany: ItemCompanySelection | null
  setItemCompany: React.Dispatch<
    React.SetStateAction<ItemCompanySelection | null>
  >
}> = ({ itemCompany, setItemCompany }) => {
  const [itemCompanies] = useGetItemCategories(ItemCategoryKind.Company, null)
  const [showDialog, setShowDialog] = React.useState<boolean>(false)
  const [proposedCompany, setProposedCompany] = React.useState<string | null>(
    null,
  )
  const [upsertItemCompany] = useUpsertItemCompanyMutation()

  return (
    <>
      <Typography align={'center'} style={{ marginTop: '30px' }}>
        Please select an associated{' '}
        <span style={{ fontWeight: 500 }}>company</span>
      </Typography>
      <div
        style={{
          paddingTop: '10px',
          textAlign: 'center',
          width: '37%',
          margin: '0 auto',
        }}
      >
        <CreatableSelect
          closeMenuOnSelect={true}
          styles={categorySelectStyle}
          value={itemCompany}
          onChange={(option) => setItemCompany(option)}
          options={itemCompanies.map(({ id, displayName }) => {
            return { label: displayName, value: id }
          })}
          onCreateOption={(option) => {
            setProposedCompany(option)
            setShowDialog(true)
          }}
          menuPosition={'fixed'}
        />
      </div>
      <Dialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>{'Create new company?'}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            The company 
            <span style={{ fontWeight: 500 }}>{proposedCompany}</span> does not
            exist, and will therefore be created and added{' '}
            <span style={{ fontWeight: 500 }}>permanently</span>.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setShowDialog(false)}>
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={() =>
              proposedCompany &&
              upsertItemCompany(
                useUpsertItemCompanyOptions(proposedCompany),
              ).then((result) => {
                if (result?.data) {
                  setItemCompany({
                    label: proposedCompany,
                    value: result.data.upsertItemCompany,
                  })
                }
                setShowDialog(false)
              })
            }
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
