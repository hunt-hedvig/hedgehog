import { MemberReferral } from 'api/generated/graphql'
import React from 'react'
import { Table } from 'semantic-ui-react'

export const MembersReferredTable: React.FunctionComponent<{
  members: MemberReferral[]
}> = ({ members }) => {
  return (
    <Table celled>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell width={6}>Member id</Table.HeaderCell>
          <Table.HeaderCell width={6}>Name</Table.HeaderCell>
          <Table.HeaderCell width={6}>Status</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {members.map((member) => (
          <Table.Row key={member.memberId + member.status}>
            <Table.Cell>{member.memberId}</Table.Cell>
            <Table.Cell>{member.name}</Table.Cell>
            <Table.Cell>{member.status}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
