import { Member } from 'api/generated/graphql'
import { ContractCountCircles } from 'components/members-search/components/ContractCountCircles'
import {
  CircleWrapper,
  MemberAgeWrapper,
} from 'components/members-search/styles'
import { format, parseISO } from 'date-fns'
import { withFadeIn } from 'hedvig-ui/animations/fade-in'
import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'
import { Table, TableRowProps } from 'semantic-ui-react'
import { getFirstMasterInception, getLastTerminationDate } from 'utils/contract'
import { getMemberFlag, getMemberIdColor, MemberAge } from 'utils/member'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'

const MemberCell = styled(Table.Cell)<{
  memberId: string
  numberMemberGroups: number
}>`
  border-left: 7px solid
    ${({ memberId, numberMemberGroups }) =>
      getMemberIdColor(memberId, numberMemberGroups)} !important;
`

const FadeInTableRow = withFadeIn<TableRowProps>(Table.Row)

export const ListItem: React.FC<{
  index: number
  member: Member
  active?: boolean
}> = ({ index, member, active }) => {
  const contracts = member.contracts

  const { numberMemberGroups } = useNumberMemberGroups()

  return (
    <FadeInTableRow active={active} delay={`${index * 50}ms`}>
      <MemberCell
        memberId={member.memberId}
        numberMemberGroups={numberMemberGroups}
      >
        {member.memberId ? (
          <Link to={`/members/${member.memberId}`}>{member.memberId}</Link>
        ) : (
          '-'
        )}
      </MemberCell>
      <Table.Cell>
        {member.firstName ?? '-'} {member.lastName ?? '-'}{' '}
        {getMemberFlag(member?.contractMarketInfo)}
        <MemberAgeWrapper>
          <MemberAge birthDateString={member.birthDate} />
        </MemberAgeWrapper>
      </Table.Cell>
      <Table.Cell>
        {member.signedOn &&
          format(parseISO(member.signedOn), 'MMM d, yyy, HH:ii')}
      </Table.Cell>
      <Table.Cell>{getFirstMasterInception(contracts)}</Table.Cell>
      <Table.Cell>{getLastTerminationDate(contracts)}</Table.Cell>
      <Table.Cell>
        <CircleWrapper>
          <ContractCountCircles contracts={contracts} />
        </CircleWrapper>
      </Table.Cell>
    </FadeInTableRow>
  )
}
