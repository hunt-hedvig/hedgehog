import {
  IconButton,
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

export const NotSpecified: React.FC = () => (
  <Typography style={{ color: '#aaa' }}>Not specified</Typography>
)

export const ItemList: React.FC<{ claimId: string }> = ({ claimId }) => {
  const [claimItems] = useGetClaimItems(claimId)
  const [deleteClaimItem] = useDeleteClaimItemMutation({
    refetchQueries: ['GetClaimItems'],
  })
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null)

  return (
    <Table style={{ marginBottom: '7px' }}>
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
            ? Number(item.purchasePrice?.amount).toLocaleString('en') +
              ' ' +
              item.purchasePrice?.currency
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
              <TableCell>{noteString ?? <NotSpecified />}</TableCell>
              <TableCell>
                <IconButton
                  style={{
                    marginRight: '-30px',
                    color: toBeDeleted ? '#aaa' : '#555',
                  }}
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
