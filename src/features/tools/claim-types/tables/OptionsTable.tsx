import {
  Table,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import React from 'react'
import { useGetClaimPropertyOptionsQuery } from 'types/generated/graphql'

export const OptionsTable: React.FC<{ filter: string }> = ({ filter }) => {
  const { data } = useGetClaimPropertyOptionsQuery()
  const claimPropertyOptions = data?.claimPropertyOptions

  if (!claimPropertyOptions) {
    return null
  }

  return (
    <Table>
      <TableHeader>
        <TableHeaderColumn>Name</TableHeaderColumn>
      </TableHeader>

      {claimPropertyOptions
        .filter((type) =>
          filter
            ? type.name.toLowerCase().includes(filter.toLowerCase())
            : true,
        )
        .map((option) => (
          <TableRow key={option.id}>
            <TableColumn>{option.name}</TableColumn>
          </TableRow>
        ))}
    </Table>
  )
}
