import { Member } from 'api/generated/graphql'
import { MemberAgeWrapper } from 'components/members-search/styles'
import { format, parseISO } from 'date-fns'
import React from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import { InsuranceStatusBadge } from 'utils/agreement'
import { MemberAge } from 'utils/member'

export const ListItem: React.FC<{ member: Member }> = ({ member }) => {
  // TODO: @Elvin, is productStatus something from ProductPricing? Verify what to resolve
  // const memberStatus =
  //  member.status !== 'SIGNED' ? member.status : item.productStatus

  const memberStatus = member?.status ?? null

  return (
    <Table.Row>
      <Table.Cell>
        {member.memberId ? (
          <Link to={`/members/${member.memberId}`}>{member.memberId}</Link>
        ) : (
          '-'
        )}
      </Table.Cell>
      <Table.Cell>
        {member.firstName ?? '-'} {member.lastName ?? '-'}
        <MemberAgeWrapper>
          <MemberAge birthDateString={member.birthDate} />
        </MemberAgeWrapper>
      </Table.Cell>
      <Table.Cell>
        {member.signedOn &&
          format(parseISO(member.signedOn), 'MMM d, yyy, HH:ii')}
      </Table.Cell>
      <Table.Cell>{'firstActiveFrom'}</Table.Cell>
      <Table.Cell>{'lastActiveTo'}</Table.Cell>
      <Table.Cell>
        {memberStatus && (
          <InsuranceStatusBadge status={memberStatus}>
            {memberStatus?.toLowerCase()}
          </InsuranceStatusBadge>
        )}
      </Table.Cell>
      <Table.Cell>householdSize</Table.Cell>
    </Table.Row>
  )
}
