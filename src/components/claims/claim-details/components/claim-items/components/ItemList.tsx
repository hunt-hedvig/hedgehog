import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableHead,
  TableRow,
  Typography,
  withStyles,
} from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import DeleteIcon from '@material-ui/icons/Delete'
import { useDeleteClaimItemMutation } from 'api/generated/graphql'
import { useGetClaimItems } from 'graphql/use-get-claim-items'
import * as React from 'react'
import { formatMoney } from '../../../../../../utils/money'

const SmallArrowRight = withStyles({
  root: {
    marginBottom: '-4px',
    marginRight: '2px',
    marginLeft: '2px',
    color: '#222',
    fontSize: 'medium',
  },
})(ArrowRightIcon)

const DeleteItemIcon = withStyles({
  root: {
    marginTop: '3px',
    color: '#555',
    fontSize: 'medium',
  },
})(DeleteIcon)

const TableCell = withStyles({
  root: {
    padding: 0,
  },
})(MuiTableCell)

const NotSpecified: React.FC = () => (
  <Typography style={{ color: '#aaa' }}>Not specified</Typography>
)

export const ItemList: React.FC<{ claimId: string }> = ({ claimId }) => {
  const [claimItems] = useGetClaimItems(claimId)
  const [deleteClaimItem] = useDeleteClaimItemMutation({
    refetchQueries: ['GetClaimItems'],
  })
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null)
  const [showNoteDialog, setShowNoteDialog] = React.useState<boolean>(false)
  const [currentNote, setCurrentNote] = React.useState<string>('')

  return (
    <Table style={{ marginBottom: '7px' }}>
      <Dialog open={showNoteDialog} onClose={() => setShowNoteDialog(false)}>
        <DialogTitle>Note</DialogTitle>
        <DialogContent>
          <DialogContentText>{currentNote}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowNoteDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <colgroup>
        <col style={{ width: '50.7%' }} />
        <col style={{ width: '16.6%' }} />
        <col style={{ width: '13.4%' }} />
        <col style={{ width: '16.3%' }} />
        <col style={{ width: '3.0%' }} />
      </colgroup>
      <TableHead style={{ padding: '0px' }}>
        <TableRow>
          <TableCell>Item</TableCell>
          <TableCell>Purchase price</TableCell>
          <TableCell>Purchase date</TableCell>
          <TableCell>Note</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>
        {claimItems.map((item) => {
          const purchasePriceString = item.purchasePrice?.amount
            ? formatMoney(
                {
                  amount: item.purchasePrice?.amount,
                  currency: item.purchasePrice?.currency,
                },
                {
                  minimumFractionDigits: 0,
                  useGrouping: true,
                },
              )
            : null

          const noteString =
            item.note && item.note.length >= 25
              ? item.note?.slice(0, 25) + '...'
              : item.note

          const toBeDeleted = itemToDelete ? itemToDelete === item.id : false

          return (
            <TableRow key={item.id}>
              <TableCell>
                {item.itemFamily.displayName}
                <SmallArrowRight />
                {item.itemType.displayName}
                {item.itemBrand && (
                  <>
                    <SmallArrowRight /> {item.itemBrand.displayName}
                  </>
                )}
                {item.itemModel && (
                  <>
                    <SmallArrowRight /> {item.itemModel.displayName}
                  </>
                )}
              </TableCell>
              <TableCell>{purchasePriceString ?? <NotSpecified />}</TableCell>
              <TableCell>{item.dateOfPurchase ?? <NotSpecified />}</TableCell>
              <TableCell>
                {noteString ? (
                  <Typography>
                    <Link
                      color="inherit"
                      style={{ textDecoration: 'none', cursor: 'pointer' }}
                      onClick={() => {
                        setCurrentNote(item?.note ?? '')
                        setShowNoteDialog(true)
                      }}
                    >
                      {noteString}
                    </Link>
                  </Typography>
                ) : (
                  <NotSpecified />
                )}
              </TableCell>
              <TableCell>
                <IconButton
                  style={{ marginRight: '-30px' }}
                  disabled={toBeDeleted}
                  onClick={() => {
                    deleteClaimItem({
                      variables: { claimItemId: item.id },
                    }).then(() => setItemToDelete(null))
                  }}
                >
                  <DeleteItemIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
