import {
  Table,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import React from 'react'
import { useGetClaimTypesQuery } from 'types/generated/graphql'

export const TypesTable: React.FC<{ filter: string }> = ({ filter }) => {
  const { data } = useGetClaimTypesQuery()
  const claimTypes = data?.claimTypes

  if (!claimTypes) {
    return null
  }

  return (
    <Table>
      <TableHeader>
        <TableHeaderColumn>Name</TableHeaderColumn>
      </TableHeader>

      {claimTypes
        .filter((type) =>
          filter ? type.toLowerCase().includes(filter.toLowerCase()) : true,
        )
        .map((type) => (
          <TableRow key={type}>
            <TableColumn>{convertEnumToTitle(type)}</TableColumn>
          </TableRow>
        ))}
    </Table>
  )
}
