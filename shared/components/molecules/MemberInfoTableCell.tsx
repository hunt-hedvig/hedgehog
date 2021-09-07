import styled from '@emotion/styled'
import { Member } from 'api/generated/graphql'
import React from 'react'
import { getMemberGroupName, getMemberIdColor } from 'utils/member'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'

const TableColumnSubtext = styled.span`
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const FlexVertically = styled.div`
  display: flex;
  flex-direction: column;
`

const FlexHorizontally = styled.div`
  display: flex;
  flex-direction: row;
`

const GroupTag = styled.span<{
  memberId: string
  numberMemberGroups: number
}>`
  display: inline-block;
  min-width: 8em;
  font-size: 0.6em;
  background-color: ${({ memberId, numberMemberGroups }) =>
    getMemberIdColor(memberId, numberMemberGroups)};
  color: ${({ theme }) => theme.accentContrast};
  padding: 0.2em 0.8em;
  border-radius: 8px;
  margin-left: 0.7em;
  margin-right: -0.7em;
  text-align: center;
`

export const MemberInfoTableCell: React.FC<{ member: Member }> = ({
  member,
}) => {
  const { numberMemberGroups } = useNumberMemberGroups()

  return (
    <FlexVertically>
      {member.firstName} {member.lastName}
      <FlexHorizontally>
        <div style={{ minWidth: '80px' }}>
          <TableColumnSubtext>{member.memberId}</TableColumnSubtext>
        </div>
        <div>
          <GroupTag
            memberId={member.memberId}
            numberMemberGroups={numberMemberGroups}
          >
            {getMemberGroupName(member.memberId, numberMemberGroups)}
          </GroupTag>
        </div>
      </FlexHorizontally>
    </FlexVertically>
  )
}
