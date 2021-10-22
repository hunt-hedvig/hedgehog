import styled from '@emotion/styled'
import { Bold, Capitalized, Popover } from '@hedvig-ui'
import React from 'react'
import { InfoCircleFill } from 'react-bootstrap-icons'
import { Table } from 'semantic-ui-react'
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

const TableRowColored = styled(Table.Row)<{
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

const AmountCell = styled(Table.Cell)<{
  entry: AccountEntry
}>`
  text-decoration: ${({ entry }) => (entry.failedAt ? 'line-through' : '')};
`

export const AccountEntryTable: React.FC<{
  accountEntries: AccountEntry[]
}> = ({ accountEntries }) => (
  <StyledTable>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Date</Table.HeaderCell>
        <Table.HeaderCell>Type</Table.HeaderCell>
        <Table.HeaderCell>Title</Table.HeaderCell>
        <Table.HeaderCell>Amount</Table.HeaderCell>
        <Table.HeaderCell width={1}>Details</Table.HeaderCell>
      </Table.Row>
    </Table.Header>

    <Table.Body>
      {accountEntries.map((entry) => (
        <TableRowColored entry={entry} key={entry.id}>
          <Table.Cell entry={entry}>{entry.fromDate}</Table.Cell>
          <Table.Cell>
            <Capitalized>{entry.type}</Capitalized>
          </Table.Cell>
          <Table.Cell>
            {entry.title && entry.title !== '' ? entry.title : 'Not specified'}
          </Table.Cell>
          <AmountCell entry={entry}>
            {formatMoney(entry.amount, {
              useGrouping: true,
              minimumFractionDigits: 2,
            })}
          </AmountCell>
          <Table.Cell textAlign="center">
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
          </Table.Cell>
        </TableRowColored>
      ))}
    </Table.Body>
  </StyledTable>
)
