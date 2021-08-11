import React from 'react'
import { Table } from 'semantic-ui-react'

export const ListHeader: React.FC = () => (
  <Table.Header>
    <Table.HeaderCell>Member</Table.HeaderCell>
    <Table.HeaderCell />
    <Table.HeaderCell>Signed Up</Table.HeaderCell>
    <Table.HeaderCell>First Master Inception</Table.HeaderCell>
    <Table.HeaderCell>Last Termination Date</Table.HeaderCell>
    <Table.HeaderCell>Contracts</Table.HeaderCell>
  </Table.Header>
)
