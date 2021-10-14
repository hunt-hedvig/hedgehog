import styled from '@emotion/styled'
import {
  LoadingMessage,
  Monetary,
  Placeholder,
  StandaloneMessage,
  Table,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { parseISO } from 'date-fns'
import formatDate from 'date-fns/format'
import { useGetMemberClaims } from 'graphql/use-get-member-claims'
import React from 'react'
import { useHistory } from 'react-router'
import { ClaimState } from 'types/generated/graphql'
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

  if (loading) {
    return <LoadingMessage paddingTop="10vh" />
  }

  if (!claims || claims.length === 0) {
    return (
      <StandaloneMessage paddingTop="10vh">
        No claims for member
      </StandaloneMessage>
    )
  }

  return (
    <>
      <Table
        onPerformNavigation={(index) => {
          const claimId = claims[index].id

          if (!claimId || !memberId) {
            return
          }

          history.push(`/claims/${claimId}`)
        }}
      >
        <TableHeader>
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
              onClick={() => history.push(`/claims/${claim.id}`)}
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
                {claim.claimType ? (
                  convertEnumToTitle(claim.claimType)
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
