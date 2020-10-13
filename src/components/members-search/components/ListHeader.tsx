import React from 'react'
import { Table } from 'semantic-ui-react'

export const ListHeader: React.FC = () => (
  <Table.Header>
    <Table.HeaderCell>Member</Table.HeaderCell>
    <Table.HeaderCell />
    <Table.HeaderCell>Sign up</Table.HeaderCell>
    <Table.HeaderCell>First active from</Table.HeaderCell>
    <Table.HeaderCell>Last active to</Table.HeaderCell>
    <Table.HeaderCell>Contracts</Table.HeaderCell>
  </Table.Header>
)
