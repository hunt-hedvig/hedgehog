import React from 'react'
import { Table } from 'semantic-ui-react'

type SortDirection = 'ascending' | 'descending'

export const ClaimListHeader: React.FC = () => {
  const [column, setColumn] = React.useState<string | null>(null)
  const [direction, setDirection] = React.useState<SortDirection>()

  const sortTable = (clickedColumn: string) => {
    if (column !== clickedColumn) {
      setColumn(clickedColumn)
      setDirection('ascending')
      return
    }

    setDirection(flippedDirection(direction))
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
        sorted={column === 'date' ? direction : undefined}
        onClick={() => sortTable('date')}
      >
        Date
      </Table.HeaderCell>
      <Table.HeaderCell
        width={6}
        sorted={column === 'type' ? direction : undefined}
        onClick={() => sortTable('type')}
      >
        Type
      </Table.HeaderCell>
      <Table.HeaderCell
        width={6}
        sorted={column === 'state' ? direction : undefined}
        onClick={() => sortTable('state')}
      >
        State
      </Table.HeaderCell>
      <Table.HeaderCell
        width={6}
        sorted={column === 'reserve' ? direction : undefined}
        onClick={() => sortTable('reserve')}
      >
        Reserves
      </Table.HeaderCell>
    </Table.Header>
  )
}
