import React from 'react'
import { Table } from 'semantic-ui-react'

type SortDirection = 'ascending' | 'descending'

enum ClaimSortColumn {
  Type = 'TYPE',
  Date = 'DATE',
  Reserve = 'RESERVE',
  State = 'STATE',
}

export const ClaimListHeader: React.FC<{
  onSort?: (column: ClaimSortColumn | null, direction?: SortDirection) => void
}> = ({ onSort }) => {
  const [column, setColumn] = React.useState<ClaimSortColumn | null>(null)
  const [direction, setDirection] = React.useState<SortDirection>('descending')

  const sortTable = (clickedColumn: ClaimSortColumn) => {
    if (column !== clickedColumn) {
      setColumn(clickedColumn)
      setDirection('ascending')

      if (onSort) {
        onSort(clickedColumn, 'ascending')
      }

      return
    }

    setDirection(flippedDirection(direction))

    if (onSort) {
      onSort(clickedColumn, flippedDirection(direction))
    }
  }

  const flippedDirection = (d?: SortDirection) => {
    if (!d) {
      return 'descending'
    }
    return d === 'ascending' ? 'descending' : 'ascending'
  }

  return (
    <Table.Header>
      <Table.HeaderCell>Member ID</Table.HeaderCell>
      <Table.HeaderCell
        width={6}
        sorted={column === ClaimSortColumn.Date ? direction : undefined}
        onClick={() => sortTable(ClaimSortColumn.Date)}
      >
        Date
      </Table.HeaderCell>
      <Table.HeaderCell
        width={6}
        sorted={column === ClaimSortColumn.Type ? direction : undefined}
        onClick={() => sortTable(ClaimSortColumn.Type)}
      >
        Type
      </Table.HeaderCell>
      <Table.HeaderCell
        width={6}
        sorted={column === ClaimSortColumn.State ? direction : undefined}
        onClick={() => sortTable(ClaimSortColumn.State)}
      >
        State
      </Table.HeaderCell>
      <Table.HeaderCell
        width={6}
        sorted={column === ClaimSortColumn.Reserve ? direction : undefined}
        onClick={() => sortTable(ClaimSortColumn.Reserve)}
      >
        Reserves
      </Table.HeaderCell>
    </Table.Header>
  )
}
