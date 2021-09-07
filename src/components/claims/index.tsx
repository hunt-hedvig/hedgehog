import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { ClaimState } from 'api/generated/graphql'
import { ListPage } from 'components/shared'
import { getPageLimits } from 'components/shared/paginator/Paginator'
import { parseISO } from 'date-fns'
import formatDate from 'date-fns/format'
import { useListClaims } from 'graphql/use-list-claims'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import { LoadingMessage } from 'hedvig-ui/animations/standalone-message'
import { Table, TableColumn, TableHeader, TableRow } from 'hedvig-ui/table'
import { Monetary, Placeholder } from 'hedvig-ui/typography'
import React, { useEffect } from 'react'
import { RouteComponentProps, useHistory } from 'react-router'
import { Header } from 'semantic-ui-react'
import { range } from 'utils/helpers'
import { useVerticalKeyboardNavigation } from 'utils/keyboard-actions'
import { getMemberGroupName, getMemberIdColor } from 'utils/member'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'
import { convertEnumToTitle } from 'utils/text'

const splitOnUpperCase = (s: string) => {
  const splitResult = s.match(/[A-Z][a-z]+|[0-9]+/g)
  return splitResult?.join(' ') ?? null
}

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

const GroupTag = styled.span<{ memberId: string; numberMemberGroups: number }>`
  display: inline-block;
  min-width: 8em;
  font-size: 0.6em;
  background-color: ${({ memberId, numberMemberGroups }) =>
    getMemberIdColor(memberId, numberMemberGroups)};
  color: ${({ theme }) => theme.accentContrast};
  padding: 0.2em 0.8em;
  border-radius: 8px;
  margin-left: 0.7em;
  margin-right: -0.7em;
  text-align: center;
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
`

const PageLink = styled.span<{ disabled: boolean }>`
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  padding: 0 1em;
  color: ${({ theme, disabled }) =>
    disabled ? theme.placeholderColor : theme.accent};
  transition: all 100ms;

  ${({ theme, disabled }) => {
    return (
      !disabled &&
      css`
        :hover {
          color: ${theme.accentLight};
        }
      `
    )
  }}
`

const PageSelectWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 1em;
`

const PageSelect: React.FC<{
  currentPage: number
  totalPages: number
  onSelect: (page: number) => void
}> = ({ currentPage, totalPages, onSelect }) => {
  const { startPage, endPage } = getPageLimits(totalPages, currentPage)
  return (
    <PageSelectWrapper>
      <PageLink disabled={currentPage === 0} onClick={() => onSelect(1)}>
        First
      </PageLink>

      {range(startPage, endPage).map((page, id) => (
        <PageLink
          key={id}
          disabled={currentPage === page}
          onClick={() => {
            onSelect(page + 1)
          }}
        >
          {page + 1}
        </PageLink>
      ))}

      <PageLink
        disabled={currentPage === totalPages - 1}
        onClick={() => {
          onSelect(totalPages - 1)
        }}
      >
        Last
      </PageLink>
    </PageSelectWrapper>
  )
}

export const ClaimsList: React.FC<RouteComponentProps<{
  page?: string
}>> = ({ match }) => {
  const history = useHistory()
  const { numberMemberGroups } = useNumberMemberGroups()
  const selectedPage = parseInt(match.params.page ?? '1', 10)
  const [
    { claims, page: currentPage, totalPages },
    listClaims,
    { loading },
  ] = useListClaims()

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

  useEffect(() => {
    listClaims({ page: selectedPage - 1 ?? 0 })
  }, [selectedPage])

  if (loading) {
    return (
      <ListPage>
        <FadeIn>
          <Header size="huge">Claims</Header>
        </FadeIn>
        <LoadingMessage paddingTop={'25vh'} />
      </ListPage>
    )
  }

  return (
    <ListPage>
      <FadeIn>
        <Header size="huge">Claims</Header>
      </FadeIn>

      <Table>
        <TableRow>
          <TableHeader>Member</TableHeader>
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
          const registrationDateTime = formatDate(
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
                  {claim.member.firstName} {claim.member.lastName}
                  <FlexHorizontally>
                    <div style={{ minWidth: '80px' }}>
                      <TableColumnSubtext>
                        {claim.member.memberId}
                      </TableColumnSubtext>
                    </div>
                    <div>
                      <GroupTag
                        memberId={claim.member.memberId}
                        numberMemberGroups={numberMemberGroups}
                      >
                        {getMemberGroupName(
                          claim.member.memberId,
                          numberMemberGroups,
                        )}
                      </GroupTag>
                    </div>
                  </FlexHorizontally>
                </FlexVertically>
              </TableColumn>
              <TableColumn>
                <FlexVertically>
                  {registrationDateString}
                  <TableColumnSubtext>
                    {registrationDateTime}
                  </TableColumnSubtext>
                </FlexVertically>
              </TableColumn>

              <TableColumn>
                {claim.type?.__typename ? (
                  splitOnUpperCase(claim?.type?.__typename?.toString())
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
      <PageSelect
        currentPage={currentPage}
        totalPages={totalPages}
        onSelect={(page) => history.push(`/claims/list/${page}`)}
      />
    </ListPage>
  )
}
