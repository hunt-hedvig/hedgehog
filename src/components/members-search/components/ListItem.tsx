import { Member } from 'api/generated/graphql'
import { MemberAgeWrapper } from 'components/members-search/styles'
import { format, parseISO } from 'date-fns'
import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import { getMemberFlag, MemberAge } from 'utils/member'

const CircleWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.accentContrast};
`

const Circle = styled.div`
  margin: 0 5px;
  height: 25px;
  width: 25px;
  background-color: ${({ theme }) => theme.success};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const ListItem: React.FC<{ member: Member }> = ({ member }) => {
  const market = member?.contractMarketInfo?.market

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
        {member.firstName ?? '-'} {member.lastName ?? '-'}{' '}
        {market && getMemberFlag(market)}
        <MemberAgeWrapper>
          <MemberAge birthDateString={member.birthDate} />
        </MemberAgeWrapper>
      </Table.Cell>
      <Table.Cell>
        {member.signedOn &&
          format(parseISO(member.signedOn), 'MMM d, yyy, HH:ii')}
      </Table.Cell>
      <Table.Cell>
        <CircleWrapper>
          <Circle>0</Circle>
          <Circle>0</Circle>
          <Circle>0</Circle>
        </CircleWrapper>
      </Table.Cell>
    </Table.Row>
  )
}
