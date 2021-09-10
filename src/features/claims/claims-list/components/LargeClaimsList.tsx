import styled from '@emotion/styled'
import {
  LoadingMessage,
  Monetary,
  Placeholder,
  Table,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TablePageSelect,
  TableRow,
} from '@hedvig-ui'
import { ClaimState } from 'api/generated/graphql'
import { parseISO } from 'date-fns'
import formatDate from 'date-fns/format'
import { useListClaims } from 'graphql/use-list-claims'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { getMemberIdColor } from 'utils/member'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'
import { convertEnumToTitle, splitOnUpperCase } from 'utils/text'

const ClaimStateBadge = styled.span<{ state: ClaimState }>`
  display: inline-block;
  min-width: 8em;
  text-align: center;
  padding: 0.3em 1em;
  background-color: ${({ theme, state }) =>
    state === ClaimState.Closed ? theme.success : theme.accent};
  color: ${({ theme }) => theme.accentContrast};
  font-size: 0.8em;
  border-radius: 8px;
`

const TableColumnSubtext = styled.span`
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const FlexVertically = styled.div`
  display: flex;
  flex-direction: column;
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

export const LargeClaimsList: React.FC<{ page: number }> = ({ page }) => {
  const history = useHistory()
  const { numberMemberGroups } = useNumberMemberGroups()

  const [
    { claims, page: currentPage, totalPages },
    listClaims,
    { loading },
  ] = useListClaims()

  useEffect(() => {
    listClaims({ page: page - 1 ?? 0 })
  }, [page])

  if (loading) {
    return <LoadingMessage paddingTop={'25vh'} />
  }

  return (
    <>
      <Table
        onPerformNavigation={(index) => {
          const claimId = claims[index].id
          const memberId = claims[index].member?.memberId

          if (!claimId || !memberId) {
            return
          }

          history.push(`/claims/${claimId}/members/${memberId}`)
        }}
      >
        <TableHeader>
          <TableHeaderColumn>Member</TableHeaderColumn>
          <TableHeaderColumn>Date Registered</TableHeaderColumn>
          <TableHeaderColumn>Claim Type</TableHeaderColumn>
          <TableHeaderColumn>Claim State</TableHeaderColumn>
          <TableHeaderColumn>Claim Reserves</TableHeaderColumn>
        </TableHeader>
        {claims.map((claim) => {
          const registrationDateString = formatDate(
            parseISO(claim.registrationDate),
            'dd MMMM, yyyy',
          )
          const registrationDateTimeString = formatDate(
            parseISO(claim.registrationDate),
            'HH:mm',
          )

          return (
            <TableRow
              key={claim.id}
              onClick={() =>
                history.push(
                  `/claims/${claim.id}/members/${claim.member.memberId}`,
                )
              }
            >
              <div>
                <MemberIdCell
                  numberMemberGroups={numberMemberGroups}
                  memberId={claim.member.memberId}
                >
                  <FlexVertically>
                    {claim.member.firstName} {claim.member.lastName}{' '}
                    <TableColumnSubtext>
                      {claim.member.memberId}
                    </TableColumnSubtext>
                  </FlexVertically>
                </MemberIdCell>
              </div>

              <TableColumn>
                <FlexVertically>
                  {registrationDateString}
                  <TableColumnSubtext>
                    {registrationDateTimeString}
                  </TableColumnSubtext>
                </FlexVertically>
              </TableColumn>

              <TableColumn>
                {claim.type?.__typename ? (
                  splitOnUpperCase(claim.type.__typename.toString())
                ) : (
                  <Placeholder>Not specified</Placeholder>
                )}
              </TableColumn>

              <TableColumn>
                <ClaimStateBadge state={claim.state}>
                  {convertEnumToTitle(claim.state)}
                </ClaimStateBadge>
              </TableColumn>

              <TableColumn>
                {claim.reserves ? (
                  <Monetary amount={claim.reserves} />
                ) : (
                  <Placeholder>Not specified</Placeholder>
                )}
              </TableColumn>
            </TableRow>
          )
        })}
      </Table>
      <TablePageSelect
        currentPage={currentPage}
        totalPages={totalPages}
        onSelect={(newPage) => history.push(`/claims/list/${newPage}`)}
      />
    </>
  )
}
