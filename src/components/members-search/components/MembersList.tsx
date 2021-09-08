import styled from '@emotion/styled'
import { Contract, ContractStatus, Member } from 'api/generated/graphql'
import { MemberInfoTableCell } from 'components/molecules/MemberInfoTableCell'
import { parseISO } from 'date-fns'
import formatDate from 'date-fns/format'
import { Table, TableColumn, TableHeader, TableRow } from 'hedvig-ui/table'
import { Placeholder } from 'hedvig-ui/typography'
import React from 'react'
import { useHistory } from 'react-router'
import { getFirstMasterInception, getLastTerminationDate } from 'utils/contract'

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

  return (
    <>
      <Table>
        <TableRow>
          <TableHeader>Member</TableHeader>
          <TableHeader>Signed Up</TableHeader>
          <TableHeader>First Master Inception</TableHeader>
          <TableHeader>Last Termination Date</TableHeader>
          <TableHeader>Contracts</TableHeader>
        </TableRow>
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
              <TableColumn style={{ maxWidth: '250px' }}>
                <MemberInfoTableCell member={member} age={true} flag={true} />
              </TableColumn>
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
