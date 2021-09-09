import { Placeholder, Spinner } from '@hedvig-ui'
import {
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell as MuiTableCell,
  TableHead,
  TableRow,
  withStyles,
} from '@material-ui/core'
import { useDeleteClaimItemMutation } from 'api/generated/graphql'
import { useGetClaimItems } from 'graphql/use-get-claim-items'
import React from 'react'
import { ChevronRight, InfoCircleFill, Trash } from 'react-bootstrap-icons'
import { formatMoney } from 'utils/money'
import {
  ChevronRightWrapper,
  InfoWrapper,
  NotePopover,
  TrashIconWrapper,
} from './styles'

const TableCell = withStyles({
  root: {
    padding: 0,
  },
})(MuiTableCell)

const NotSpecified: React.FC = () => <Placeholder>Not specified</Placeholder>

export const ItemList: React.FC<{ claimId: string }> = ({ claimId }) => {
  const [claimItems, { loading: loadingClaimItems }] = useGetClaimItems(claimId)
  const [deleteClaimItem] = useDeleteClaimItemMutation({
    refetchQueries: ['GetClaimItems'],
  })
  const [itemToDelete, setItemToDelete] = React.useState<string | null>(null)

  return (
    <>
      {loadingClaimItems && <Spinner />}
      <Table style={{ marginBottom: '7px' }}>
        <colgroup>
          <col style={{ width: '50.5%' }} />
          <col style={{ width: '17.0%' }} />
          <col style={{ width: '9.0%' }} />
          <col style={{ width: '20.0%' }} />
          <col style={{ width: '3.5%' }} />
        </colgroup>
        <TableHead style={{ padding: '0px' }}>
          <TableRow>
            <TableCell>Item</TableCell>
            <TableCell>Purchase price</TableCell>
            <TableCell>Purchase date</TableCell>
            <TableCell>Valuation</TableCell>
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

            const valuationString = item.valuation?.amount
              ? formatMoney(
                  {
                    amount: item.valuation?.amount,
                    currency: item.valuation?.currency,
                  },
                  {
                    minimumFractionDigits: 0,
                    useGrouping: true,
                  },
                )
              : null

            const toBeDeleted = itemToDelete ? itemToDelete === item.id : false

            return (
              <TableRow key={item.id}>
                <TableCell>
                  {item.itemFamily.displayName}
                  <ChevronRightWrapper>
                    <ChevronRight />
                  </ChevronRightWrapper>

                  {item.itemType.displayName}
                  {item.itemBrand && (
                    <>
                      <ChevronRightWrapper>
                        <ChevronRight />
                      </ChevronRightWrapper>
                      {item.itemBrand.displayName}
                    </>
                  )}
                  {item.itemModel && (
                    <>
                      <ChevronRightWrapper>
                        <ChevronRight />
                      </ChevronRightWrapper>{' '}
                      {item.itemModel.displayName}
                    </>
                  )}
                </TableCell>
                <TableCell>{purchasePriceString ?? <NotSpecified />}</TableCell>
                <TableCell>{item.dateOfPurchase ?? <NotSpecified />}</TableCell>
                <TableCell>{valuationString ?? <NotSpecified />}</TableCell>
                <TableCell>
                  <Grid container spacing={8}>
                    <Grid item xs={6}>
                      {item?.note && (
                        <NotePopover contents={<>{item?.note}</>}>
                          <InfoWrapper>
                            <InfoCircleFill />
                          </InfoWrapper>
                        </NotePopover>
                      )}
                    </Grid>
                    <Grid item xs={6}>
                      <IconButton
                        disabled={toBeDeleted}
                        onClick={() => {
                          deleteClaimItem({
                            variables: { claimItemId: item.id },
                          }).then(() => setItemToDelete(null))
                        }}
                      >
                        <TrashIconWrapper>
                          <Trash />
                        </TrashIconWrapper>
                      </IconButton>
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </>
  )
}
