import React from 'react'
import { Table } from 'semantic-ui-react'

export const ListHeader: React.FC = () => (
  <Table.Header>
    <Table.HeaderCell>Member ID</Table.HeaderCell>
    <Table.HeaderCell>Date</Table.HeaderCell>
    <Table.HeaderCell>Type</Table.HeaderCell>
    <Table.HeaderCell>State</Table.HeaderCell>
    <Table.HeaderCell>Reserves</Table.HeaderCell>
  </Table.Header>
)
