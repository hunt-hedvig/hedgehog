import {
  getTextFromEnumValue,
  Table,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import React from 'react'
import { useGetClaimTypeRelationsQuery } from 'types/generated/graphql'

export const RelationsTable: React.FC<{ filter: string }> = ({ filter }) => {
  const { data } = useGetClaimTypeRelationsQuery()
  const claimTypeRelations = data?.claimTypeRelations

  if (!claimTypeRelations) {
    return null
  }

  return (
    <Table>
      <TableHeader>
        <TableHeaderColumn>Type</TableHeaderColumn>
        <TableHeaderColumn>Property</TableHeaderColumn>
        <TableHeaderColumn>Option</TableHeaderColumn>
      </TableHeader>

      {claimTypeRelations
        .filter((relation) => {
          if (!filter) {
            return true
          }

          if (relation.claimType.toLowerCase().includes(filter.toLowerCase())) {
            return true
          }

          if (
            relation.property.name.toLowerCase().includes(filter.toLowerCase())
          ) {
            return true
          }

          if (
            relation.propertyOption.name
              .toLowerCase()
              .includes(filter.toLowerCase())
          ) {
            return true
          }

          return false
        })
        .map((relation) => (
          <>
            <TableRow key={relation.id}>
              <TableColumn>
                {getTextFromEnumValue(relation.claimType)}
              </TableColumn>
              <TableColumn>{relation.property.name}</TableColumn>
              <TableColumn>{relation.propertyOption.name}</TableColumn>
            </TableRow>
          </>
        ))}
    </Table>
  )
}
