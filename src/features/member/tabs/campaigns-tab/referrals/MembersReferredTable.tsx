import { Capitalized } from '@hedvig-ui'
import { MemberReferral } from 'api/generated/graphql'
import { MemberStatusBadge } from 'features/member/tabs/campaigns-tab/styles'
import React from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'

export const MembersReferredTable: React.FC<{
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
            <Table.Cell>
              <Link to={`/members/${member.memberId}`}>{member.memberId}</Link>
            </Table.Cell>
            <Table.Cell>{member.name}</Table.Cell>
            <Table.Cell>
              <MemberStatusBadge status={member.status}>
                <Capitalized>{member.status}</Capitalized>
              </MemberStatusBadge>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}
