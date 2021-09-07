import styled from '@emotion/styled'
import { ClaimState } from 'api/generated/graphql'
import { ClaimTypeTableCell } from 'components/molecules/ClaimTypeTableCell'
import { DateTimeTableCell } from 'components/molecules/DateTimeTableCell'
import { MemberInfoTableCell } from 'components/molecules/MemberInfoTableCell'
import { TablePageSelect } from 'components/molecules/TablePageSelect'
import { parseISO } from 'date-fns'
import { useListClaims } from 'graphql/use-list-claims'
import { LoadingMessage } from 'hedvig-ui/animations/standalone-message'
import { Table, TableColumn, TableHeader, TableRow } from 'hedvig-ui/table'
import { Monetary, Placeholder } from 'hedvig-ui/typography'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { useVerticalKeyboardNavigation } from 'utils/keyboard-actions'
import { convertEnumToTitle } from 'utils/text'

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

export const LargeClaimsList: React.FC<{ page: number }> = ({ page }) => {
  const history = useHistory()
  const [
    { claims, page: currentPage, totalPages },
    listClaims,
  ] = useListClaims()

  useEffect(() => {
    listClaims({ page: page - 1 ?? 0 })
  }, [page])

  const [currentKeyboardNavigationStep] = useVerticalKeyboardNavigation({
    maxStep: claims.length - 1,
    onPerformNavigation: (index) => {
      const claimId = claims[index].id
      const memberId = claims[index].member?.memberId

      if (!claimId || !memberId) {
        return
      }

      history.push(`/claims/${claimId}/members/${memberId}`)
    },
  })

  if (!claims) {
    return <LoadingMessage paddingTop={'25vh'} />
  }

  return (
    <>
      <Table>
        <TableRow>
          <TableHeader>Member</TableHeader>
          <TableHeader>Date Registered</TableHeader>
          <TableHeader>Claim Type</TableHeader>
          <TableHeader>Claim State</TableHeader>
          <TableHeader>Claim Reserves</TableHeader>
        </TableRow>
        {claims.map((claim, index) => {
          return (
            <TableRow
              key={claim.id}
              active={currentKeyboardNavigationStep === index}
              onClick={() =>
                history.push(
                  `/claims/${claim.id}/members/${claim.member.memberId}`,
                )
              }
            >
              <TableColumn>
                <MemberInfoTableCell member={claim.member} />
              </TableColumn>

              <TableColumn>
                <DateTimeTableCell date={parseISO(claim.registrationDate)} />
              </TableColumn>

              <TableColumn>
                <ClaimTypeTableCell type={claim.type} />
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
