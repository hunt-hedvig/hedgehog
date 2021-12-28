import styled from '@emotion/styled'
import {
  Placeholder,
  Spacing,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { parseISO } from 'date-fns'
import formatDate from 'date-fns/format'
import {
  getFirstMasterInception,
  getLastTerminationDate,
} from 'portals/hope/features/member/tabs/contracts-tab/utils'
import { getMemberFlag, MemberAge } from 'portals/hope/features/member/utils'
import React from 'react'
import { useHistory } from 'react-router'
import { Contract, ContractStatus, Member } from 'types/generated/graphql'

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
}> = ({ members }) => {
  const history = useHistory()
  const isCommandPressed = useKeyIsPressed(Keys.Command)

  const redirectMemberHandler = (id: string) => {
    const link = `/members/${id}/contracts`

    if (isCommandPressed) {
      window.open(link, '_blank')
      return
    }

    history.push(link)
  }

  return (
    <>
      <Spacing top />
      <Table>
        <TableHeader>
          <TableHeaderColumn>Member</TableHeaderColumn>
          <TableHeaderColumn>Signed Up</TableHeaderColumn>
          <TableHeaderColumn>First Master Inception</TableHeaderColumn>
          <TableHeaderColumn>Last Termination Date</TableHeaderColumn>
          <TableHeaderColumn>Contracts</TableHeaderColumn>
        </TableHeader>
        <TableBody>
          {members.map((member, index) => {
            const {
              ACTIVE_IN_FUTURE: activeInFutureContracts = 0,
              ACTIVE: activeContracts = 0,
              PENDING: pendingContracts = 0,
              TERMINATED: terminatedContracts = 0,
            } = countContractsByStatus(member.contracts)

            return (
              <TableRow
                index={index}
                length={members.length}
                onResolve={(selectedIndex) => {
                  const memberId = members[selectedIndex].memberId

                  if (!memberId) {
                    return
                  }

                  redirectMemberHandler(memberId)
                }}
                key={member.memberId}
                tabIndex={0}
                onClick={() => redirectMemberHandler(member.memberId)}
              >
                <TableColumn>
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
                </TableColumn>

                <TableColumn>
                  {member.signedOn && (
                    <FlexVertically>
                      {formatDate(parseISO(member.signedOn), 'dd MMMM, yyyy')}
                      <TableColumnSubtext>
                        {formatDate(parseISO(member.signedOn), 'HH:mm')}
                      </TableColumnSubtext>
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
                          activeInFutureContracts
                            ? 'accent'
                            : 'placeholderColor'
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
        </TableBody>
      </Table>
    </>
  )
}
