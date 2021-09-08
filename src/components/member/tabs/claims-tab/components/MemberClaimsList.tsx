import styled from '@emotion/styled'
import { ClaimState } from 'api/generated/graphql'
import { parseISO } from 'date-fns'
import formatDate from 'date-fns/format'
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
              active={currentKeyboardNavigationStep === index}
              onClick={() =>
                history.push(
                  `/claims/${claim.id}/members/${claim.member.memberId}`,
                )
              }
            >
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
    </>
  )
}
