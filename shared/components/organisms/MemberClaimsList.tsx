import styled from '@emotion/styled'
import { ClaimState } from 'api/generated/graphql'
import { ClaimTypeTableCell } from 'components/molecules/ClaimTypeTableCell'
import { DateTimeTableCell } from 'components/molecules/DateTimeTableCell'
import { parseISO } from 'date-fns'
import { useGetMemberClaims } from 'graphql/use-get-member-claims'
import {
  LoadingMessage,
  StandaloneMessage,
} from 'hedvig-ui/animations/standalone-message'
import { Table, TableColumn, TableHeader, TableRow } from 'hedvig-ui/table'
import { Monetary, Placeholder } from 'hedvig-ui/typography'
import React from 'react'
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

export const MemberClaimsList: React.FC<{ memberId: string }> = ({
  memberId,
}) => {
  const history = useHistory()
  const [memberClaims, { loading }] = useGetMemberClaims(memberId)

  const claims = memberClaims ?? []

  const [currentKeyboardNavigationStep] = useVerticalKeyboardNavigation({
    maxStep: claims.length - 1,
    onPerformNavigation: (index) => {
      const claimId = claims[index].id

      if (!claimId || !memberId) {
        return
      }

      history.push(`/claims/${claimId}/members/${memberId}`)
    },
  })

  if (loading) {
    return <LoadingMessage paddingTop={'10vh'} />
  }

  if (!claims || claims.length === 0) {
    return (
      <StandaloneMessage paddingTop={'10vh'}>
        No claims for member
      </StandaloneMessage>
    )
  }

  return (
    <>
      <Table>
        <TableRow>
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
    </>
  )
}
