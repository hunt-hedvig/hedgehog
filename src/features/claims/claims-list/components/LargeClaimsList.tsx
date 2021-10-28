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
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { parseISO } from 'date-fns'
import formatDate from 'date-fns/format'
import { useListClaims } from 'graphql/use-list-claims'
import { ClaimsFiltersType } from 'pages/claims/list/ClaimsListPage'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { ClaimState } from 'types/generated/graphql'
import { getMemberIdColor } from 'utils/member'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'
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

const MemberIdCell = styled(TableColumn)<{
  memberId: string
  numberMemberGroups: number
}>`
  border-left: 7px solid
    ${({ memberId, numberMemberGroups }) =>
      getMemberIdColor(memberId, numberMemberGroups)} !important;

  padding-left: 1em;
  height: 100%;
`

export const LargeClaimsList: React.FC<{
  page: number
  filters: ClaimsFiltersType
}> = ({ page, filters }) => {
  const history = useHistory()
  const { numberMemberGroups } = useNumberMemberGroups()
  const isCommandPressed = useKeyIsPressed(Keys.Command)

  const [
    { claims, page: currentPage, totalPages },
    listClaims,
    { loading },
  ] = useListClaims()

  useEffect(() => {
    listClaims({
      page: page - 1 ?? 0,
      ...filters,
    })
  }, [page, filters])

  if (loading) {
    return <LoadingMessage paddingTop="25vh" />
  }

  const redirectClaimHandler = (id: string) => {
    const link = `/claims/${id}`

    if (isCommandPressed) {
      window.open(link, '_blank')
      return
    }

    history.push(link)
  }

  return (
    <>
      <Table
        onPerformNavigation={(index) => {
          const claimId = claims[index].id

          if (!claimId) {
            return
          }

          redirectClaimHandler(claimId)
        }}
      >
        <TableHeader>
          <TableHeaderColumn>Member</TableHeaderColumn>
          <TableHeaderColumn>Date Registered</TableHeaderColumn>
          <TableHeaderColumn>Type & Outcome</TableHeaderColumn>
          <TableHeaderColumn>State</TableHeaderColumn>
          <TableHeaderColumn>Reserves</TableHeaderColumn>
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
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.keyCode === Keys.Enter.code) {
                  e.preventDefault()
                  history.push(`/claims/${claim.id}`)
                }
              }}
              onClick={() => redirectClaimHandler(claim.id)}
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
                <FlexVertically>
                  {claim.claimType ? (
                    convertEnumToTitle(claim.claimType)
                  ) : (
                    <Placeholder>Type not specified</Placeholder>
                  )}
                  <TableColumnSubtext>
                    {claim.outcome ? (
                      convertEnumToTitle(claim.outcome)
                    ) : (
                      <Placeholder>Outcome not specified</Placeholder>
                    )}
                  </TableColumnSubtext>
                </FlexVertically>
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
