import { MemberReferral } from 'api/generated/graphql'
import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'

interface MemberStatusBadgeProps {
  status?: string
}

const MemberStatusBadge = styled.div<MemberStatusBadgeProps>`
  padding: 0.5rem 1rem;
  line-height: 1;
  background: ${({ theme, status }) =>
    status === 'ACTIVE'
      ? theme.success
      : status === 'UNREDEEMED'
      ? theme.danger
      : theme.accent};
  border-radius: 16px;
  color: ${({ theme }) => theme.accentContrast};
  text-align: center;
  width: auto;
`

export const Capitalized = styled.div`
  ::first-letter {
    text-transform: uppercase;
  }
  text-transform: lowercase;
`

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
