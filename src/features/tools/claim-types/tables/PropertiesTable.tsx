import {
  Table,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import React from 'react'
import { useGetClaimPropertiesQuery } from 'types/generated/graphql'

export const PropertiesTable: React.FC<{ filter: string }> = ({ filter }) => {
  const { data } = useGetClaimPropertiesQuery()
  const claimProperties = data?.claimProperties

  if (!claimProperties) {
    return null
  }

  return (
    <Table>
      <TableHeader>
        <TableHeaderColumn>Name</TableHeaderColumn>
      </TableHeader>

      {claimProperties
        .filter((property) =>
          filter
            ? property.name.toLowerCase().includes(filter.toLowerCase())
            : true,
        )
        .map((property) => (
          <TableRow key={property.id}>
            <TableColumn>{property.name}</TableColumn>
          </TableRow>
        ))}
    </Table>
  )
}
