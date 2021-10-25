import styled from '@emotion/styled'
import {
  Bold,
  Capitalized,
  Popover,
  Table,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import React from 'react'
import { InfoCircleFill } from 'react-bootstrap-icons'
import { AccountEntry } from 'types/generated/graphql'
import { formatMoney } from 'utils/money'
import { PopoverItem } from './MonthlyEntriesTable'

const getAccountEntryColor = (theme, entry: AccountEntry) => {
  if (entry.failedAt) {
    return theme.lightDanger
  }

  if (entry.chargedAt && entry.type === 'CHARGE') {
    return theme.lightSuccess
  }

  if (parseFloat(entry.amount.amount) < 0) {
    return theme.lightWarning
  }

  return theme.backgroundTransparent
}

const TableRowColored = styled(TableRow)<{
  entry: AccountEntry
}>`
  td {
    background-color: ${({ theme, entry }) =>
      getAccountEntryColor(theme, entry)} !important;
  }
`

const StyledTable = styled(Table)`
  overflow: visible !important;
`

const AmountCell = styled(TableColumn)<{
  entry: AccountEntry
}>`
  text-decoration: ${({ entry }) => (entry.failedAt ? 'line-through' : '')};
`

export const AccountEntryTable: React.FC<{
  accountEntries: AccountEntry[]
}> = ({ accountEntries }) => (
  <StyledTable>
    <TableHeader>
      <TableHeaderColumn>Date</TableHeaderColumn>
      <TableHeaderColumn>Type</TableHeaderColumn>
      <TableHeaderColumn>Title</TableHeaderColumn>
      <TableHeaderColumn>Amount</TableHeaderColumn>
      <TableHeaderColumn style={{ width: 90, textAlign: 'center' }}>
        Details
      </TableHeaderColumn>
    </TableHeader>

    {accountEntries.map((entry) => (
      <TableRowColored entry={entry} key={entry.id}>
        <AmountCell entry={entry}>{entry.fromDate}</AmountCell>
        <TableColumn>
          <Capitalized>{entry.type}</Capitalized>
        </TableColumn>
        <TableColumn>
          {entry.title && entry.title !== '' ? entry.title : 'Not specified'}
        </TableColumn>
        <AmountCell entry={entry}>
          {formatMoney(entry.amount, {
            useGrouping: true,
            minimumFractionDigits: 2,
          })}
        </AmountCell>
        <TableColumn style={{ textAlign: 'center', width: 90 }}>
          <Popover
            contents={
              <>
                <PopoverItem>
                  <Bold>Entry ID</Bold>
                  {entry.id}
                </PopoverItem>
                <PopoverItem>
                  <Bold>Reference</Bold>
                  {entry.reference}
                </PopoverItem>
                <PopoverItem>
                  <Bold>Source</Bold>
                  {entry.source}
                </PopoverItem>
                {entry.comment && (
                  <PopoverItem>
                    <Bold>Comment</Bold>
                    {entry.comment}
                  </PopoverItem>
                )}
              </>
            }
          >
            <InfoCircleFill />
          </Popover>
        </TableColumn>
      </TableRowColored>
    ))}
  </StyledTable>
)
