import {
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableHead,
  TableRow,
  withStyles,
} from '@material-ui/core'
import ArrowRightIcon from '@material-ui/icons/ArrowRight'
import { useGetClaimItems } from 'graphql/use-get-claim-items'
import * as React from 'react'

export const SmallArrowRight = withStyles({
  root: {
    marginBottom: '-4px',
    marginRight: '2px',
    marginLeft: '2px',
    color: '#222',
    fontSize: 'medium',
  },
})(ArrowRightIcon)

export const TableCell = withStyles({
  root: {
    padding: 0,
  },
})(MuiTableCell)

export const ItemList: React.FC<{ claimId: string }> = ({ claimId }) => {
  const [claimItems] = useGetClaimItems(claimId)

  return (
    <Table style={{ marginBottom: '7px' }}>
      <colgroup>
        <col style={{ width: '50.7%' }} />
        <col style={{ width: '16.6%' }} />
        <col style={{ width: '13.4%' }} />
        <col style={{ width: '19.3%' }} />
      </colgroup>
      <TableHead style={{ padding: '0px' }}>
        <TableRow>
          <TableCell>Item</TableCell>
          <TableCell>Purchase price</TableCell>
          <TableCell>Purchase date</TableCell>
          <TableCell>Note</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {claimItems.map((item) => {
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
              <TableCell>
                {item.purchasePriceAmount?.amount}{' '}
                {item.purchasePriceAmount?.currency}
              </TableCell>
              <TableCell>{item.dateOfPurchase}</TableCell>
              <TableCell>{item.note}</TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
