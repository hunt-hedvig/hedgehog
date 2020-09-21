import React from 'react'
import { Table } from 'semantic-ui-react'

export const ListHeader: React.FC = () => (
  <Table.Header>
    <Table.HeaderCell>Member</Table.HeaderCell>
    <Table.HeaderCell />
    <Table.HeaderCell>Sign up</Table.HeaderCell>
    <Table.HeaderCell>Active from</Table.HeaderCell>
    <Table.HeaderCell>Active to</Table.HeaderCell>
    <Table.HeaderCell>Status</Table.HeaderCell>
    <Table.HeaderCell>Size</Table.HeaderCell>
  </Table.Header>
)
