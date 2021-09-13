import styled from '@emotion/styled'
import {
  Placeholder,
  Table,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { parseISO } from 'date-fns'
import formatDate from 'date-fns/format'
import React from 'react'
import { useHistory } from 'react-router'
import { Contract, ContractStatus, Member } from 'types/generated/graphql'
import { getFirstMasterInception, getLastTerminationDate } from 'utils/contract'
import { getMemberFlag, getMemberIdColor, MemberAge } from 'utils/member'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'

type CircleVariation =
  | 'success'
  | 'warning'
  | 'danger'
  | 'accent'
  | 'placeholderColor'

const ContractCountWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const ContractCountNumber = styled.div<{ variation?: CircleVariation }>`
  color: white;
  background-color: ${({ theme, variation = 'accent' }) => theme[variation]};
  padding: 0.2em 0.6em;
  border-radius: 6px;
  font-size: 0.8em;
  min-width: 2em;
  text-align: center;
`

const ContractCountLabel = styled.div`
  font-size: 0.7em;
  color: ${({ theme }) => theme.semiStrongForeground};
  margin-top: 0.3em;
`

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
  align-items: center;
`

const MemberAgeWrapper = styled.span`
  font-size: 0.7em;
  margin-left: 0.7em;
  margin-right: -0.7em;
  padding-top: 0.3em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const MemberIdCell = styled(TableColumn)<{
  memberId: string
  numberMemberGroups: number
}>`
  border-left: 7px solid
    ${({ memberId, numberMemberGroups }) =>
      getMemberIdColor(memberId, numberMemberGroups)};

  padding-left: 1em;
  height: 100%;
`

type NumberOfContracts = {
  [key in ContractStatus]?: number
}

const countContractsByStatus = (contracts: Contract[]): NumberOfContracts =>
  contracts.reduce((acc, { status }) => {
    const groupedStatus = [
      ContractStatus.Pending,
      ContractStatus.Terminated,
      ContractStatus.ActiveInFuture,
    ].includes(status)
      ? status
      : ContractStatus.Active
    return {
      ...acc,
      [groupedStatus]: (acc[groupedStatus] || 0) + 1,
    }
  }, {})

export const MembersList: React.FC<{
  members: Member[]
  navigationStep?: number
}> = ({ members, navigationStep }) => {
  const history = useHistory()
  const { numberMemberGroups } = useNumberMemberGroups()

  return (
    <>
      <Table>
        <TableHeader>
          <TableHeaderColumn>Member</TableHeaderColumn>
          <TableHeaderColumn>Signed Up</TableHeaderColumn>
          <TableHeaderColumn>First Master Inception</TableHeaderColumn>
          <TableHeaderColumn>Last Termination Date</TableHeaderColumn>
          <TableHeaderColumn>Contracts</TableHeaderColumn>
        </TableHeader>
        {members.map((member, index) => {
          const {
            ACTIVE_IN_FUTURE: activeInFutureContracts = 0,
            ACTIVE: activeContracts = 0,
            PENDING: pendingContracts = 0,
            TERMINATED: terminatedContracts = 0,
          } = countContractsByStatus(member.contracts)

          const dateString = formatDate(
            parseISO(member.signedOn),
            'dd MMMM, yyyy',
          )
          const timeString = formatDate(parseISO(member.signedOn), 'HH:mm')

          return (
            <TableRow
              key={member.memberId}
              active={navigationStep === index}
              onClick={() => history.push(`/members/${member.memberId}`)}
            >
              <div>
                <MemberIdCell
                  numberMemberGroups={numberMemberGroups}
                  memberId={member.memberId}
                  style={{
                    maxWidth: '250px',
                  }}
                >
                  <FlexVertically>
                    {member.firstName} {member.lastName}{' '}
                    {getMemberFlag(member.contractMarketInfo)}
                    <FlexHorizontally>
                      <TableColumnSubtext>{member.memberId}</TableColumnSubtext>
                      <MemberAgeWrapper>
                        <MemberAge birthDateString={member.birthDate} />
                      </MemberAgeWrapper>
                    </FlexHorizontally>
                  </FlexVertically>
                </MemberIdCell>
              </div>
              <TableColumn>
                {member.signedOn && (
                  <FlexVertically>
                    {dateString}
                    <TableColumnSubtext>{timeString}</TableColumnSubtext>
                  </FlexVertically>
                )}
              </TableColumn>
              <TableColumn>
                {getFirstMasterInception(member.contracts)}
              </TableColumn>
              <TableColumn>
                {getLastTerminationDate(member.contracts) ?? (
                  <Placeholder>Not specified</Placeholder>
                )}
              </TableColumn>
              <TableColumn>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <ContractCountWrapper>
                    <ContractCountNumber
                      variation={
                        pendingContracts ? 'warning' : 'placeholderColor'
                      }
                    >
                      {pendingContracts}
                    </ContractCountNumber>
                    <ContractCountLabel>Pending</ContractCountLabel>
                  </ContractCountWrapper>
                  <ContractCountWrapper>
                    <ContractCountNumber
                      variation={
                        activeInFutureContracts ? 'accent' : 'placeholderColor'
                      }
                    >
                      {activeInFutureContracts}
                    </ContractCountNumber>
                    <ContractCountLabel>Active in future</ContractCountLabel>
                  </ContractCountWrapper>
                  <ContractCountWrapper>
                    <ContractCountNumber
                      variation={
                        activeContracts ? 'success' : 'placeholderColor'
                      }
                    >
                      {activeContracts}
                    </ContractCountNumber>
                    <ContractCountLabel>Active</ContractCountLabel>
                  </ContractCountWrapper>
                  <ContractCountWrapper>
                    <ContractCountNumber
                      variation={
                        terminatedContracts ? 'danger' : 'placeholderColor'
                      }
                    >
                      {terminatedContracts}
                    </ContractCountNumber>
                    <ContractCountLabel>Terminated</ContractCountLabel>
                  </ContractCountWrapper>
                </div>
              </TableColumn>
            </TableRow>
          )
        })}
      </Table>
    </>
  )
}
