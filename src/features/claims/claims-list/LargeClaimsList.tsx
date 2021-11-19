import styled from '@emotion/styled'
import {
  Button,
  LoadingMessage,
  Monetary,
  Placeholder,
  SecondLevelHeadline,
  Table,
  TableBody,
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
import { useTitle } from '@hedvig-ui/hooks/use-title'
import { convertEnumToTitle } from '@hedvig-ui/utils/text'
import { parseISO } from 'date-fns'
import formatDate from 'date-fns/format'
import { useListClaims } from 'features/claims/claims-list/graphql/use-list-claims'
import { getMemberIdColor } from 'features/member/utils'
import { useMe } from 'features/user/hooks/use-me'
import { useNumberMemberGroups } from 'features/user/hooks/use-number-member-groups'
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { ClaimState, UserSettingKey } from 'types/generated/graphql'

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

export const StatusLine = styled.div<{
  memberId: string
  numberMemberGroups: number
}>`
  position: absolute;
  width: 7px;
  height: calc(100% + 1px);

  left: 0;
  top: 0;

  background-color: ${({ memberId, numberMemberGroups }) =>
    getMemberIdColor(memberId, numberMemberGroups)} !important;
`

const EmptyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 5em;

  width: 100%;
  height: 100%;
`

export const LargeClaimsList: React.FC<{
  page: number
  date: string | null
}> = ({ page, date }) => {
  const { settings } = useMe()
  const history = useHistory()
  const { numberMemberGroups } = useNumberMemberGroups()
  const isCommandPressed = useKeyIsPressed(Keys.Command)
  const [activeRow, setActiveRow] = useState<number | null>(null)

  useTitle('Claims')

  const [
    { claims, page: currentPage, totalPages },
    listClaims,
    { loading },
  ] = useListClaims()

  useEffect(() => {
    listClaims({
      page: page - 1 ?? 0,
      filterCreatedBeforeOrOnDate: date,
      filterClaimStates:
        (settings[UserSettingKey.ClaimStatesFilter] &&
          settings[UserSettingKey.ClaimStatesFilter].claims) ||
        null,
      filterComplexities:
        (settings[UserSettingKey.ClaimComplexityFilter] &&
          settings[UserSettingKey.ClaimComplexityFilter].claims) ||
        null,
      filterNumberOfMemberGroups:
        (settings[UserSettingKey.NumberOfMemberGroups] &&
          settings[UserSettingKey.NumberOfMemberGroups].value) ||
        null,
      filterSelectedMemberGroups:
        (settings[UserSettingKey.MemberGroupsFilter] &&
          settings[UserSettingKey.MemberGroupsFilter].claims) ||
        null,
      filterMarkets:
        (settings[UserSettingKey.MarketFilter] &&
          settings[UserSettingKey.MarketFilter].claims) ||
        null,
      filterTypesOfContract: null,
    })
  }, [page, date, settings])

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

  if (!loading && claims.length === 0) {
    return (
      <EmptyWrapper>
        <SecondLevelHeadline>
          <Placeholder>Sorry, no claims to be found here</Placeholder>
        </SecondLevelHeadline>
        <Button
          style={{ marginTop: '1em' }}
          variant="secondary"
          onClick={() => history.push('/claims/list/1')}
        >
          Go to first page
        </Button>
      </EmptyWrapper>
    )
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableHeaderColumn>Member</TableHeaderColumn>
          <TableHeaderColumn>Date Registered</TableHeaderColumn>
          <TableHeaderColumn>Type & Outcome</TableHeaderColumn>
          <TableHeaderColumn>State</TableHeaderColumn>
          <TableHeaderColumn>Reserves</TableHeaderColumn>
        </TableHeader>
        <TableBody
          setActiveRow={(num) => setActiveRow(num)}
          onPerformNavigation={(index) => {
            const claimId = claims[index].id

            if (!claimId) {
              return
            }

            redirectClaimHandler(claimId)
          }}
        >
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
                active={activeRow === index}
                key={claim.id}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === Keys.Enter.key) {
                    e.preventDefault()
                    history.push(`/claims/${claim.id}`)
                  }
                }}
                onClick={() => redirectClaimHandler(claim.id)}
              >
                <TableColumn style={{ position: 'relative' }}>
                  <FlexVertically style={{ paddingLeft: '7px' }}>
                    {claim.member.firstName} {claim.member.lastName}{' '}
                    <TableColumnSubtext>
                      {claim.member.memberId}
                    </TableColumnSubtext>
                  </FlexVertically>
                  <StatusLine
                    numberMemberGroups={numberMemberGroups}
                    memberId={claim.member.memberId}
                  />
                </TableColumn>

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
        </TableBody>
      </Table>
      <TablePageSelect
        currentPage={currentPage}
        totalPages={totalPages}
        onSelect={(newPage) => history.push(`/claims/list/${newPage}`)}
      />
    </>
  )
}
