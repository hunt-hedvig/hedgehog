import React from 'react'
import { Table } from 'semantic-ui-react'

export const CampaignsRedeemedTable: React.FunctionComponent<{}> = () => {
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={6}>Member id</Table.HeaderCell>
          <Table.HeaderCell width={6}>Name</Table.HeaderCell>
          <Table.HeaderCell width={6}>Status</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body />
    </Table>
  )
}
