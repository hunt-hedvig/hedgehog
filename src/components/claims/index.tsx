import styled from '@emotion/styled'
import { Claim, ClaimState } from 'api/generated/graphql'
import { ListPage } from 'components/shared'
import { Paginator } from 'components/shared/paginator/Paginator'
import { parseISO } from 'date-fns'
import formatDate from 'date-fns/format'
import { useListClaims } from 'graphql/use-list-claims'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import { LoadingMessage } from 'hedvig-ui/animations/standalone-message'
import { Spacing } from 'hedvig-ui/spacing'
import { Table, TableColumn, TableHeader, TableRow } from 'hedvig-ui/table'
import { Monetary, Placeholder } from 'hedvig-ui/typography'
import React, { useEffect } from 'react'
import { RouteComponentProps, useHistory } from 'react-router'
import { Header } from 'semantic-ui-react'
import { useVerticalKeyboardNavigation } from 'utils/keyboard-actions'
import { getMemberGroupName, getMemberIdColor } from 'utils/member'
import { useNumberMemberGroups } from 'utils/number-member-groups-context'
import { convertEnumToTitle } from 'utils/text'
import { ClaimListHeader } from './claims-list/components/ClaimListHeader'
import { ClaimListItem } from './claims-list/components/ClaimListItem'

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

  return (
    <ListPage>
      <FadeIn>
        <Header size="huge">Claims</Header>
      </FadeIn>
      {loading && !claims ? <LoadingMessage paddingTop={'25vh'} /> : <></>}

      <Table>
        <TableRow>
          <TableHeader>Member</TableHeader>
          <TableHeader>Date Registered</TableHeader>
          <TableHeader>Claim Type</TableHeader>
          <TableHeader>Claim State</TableHeader>
          <TableHeader>Claim Reserves</TableHeader>
        </TableRow>
        {claims.map((claim) => {
          const registrationDateString = formatDate(
            parseISO(claim.registrationDate),
            'dd MMMM, yyyy',
          )
          const registrationDateTime = formatDate(
            parseISO(claim.registrationDate),
            'HH:mm',
          )
          return (
            <TableRow>
              <TableColumn>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <span>
                    {claim.member.firstName} {claim.member.lastName}
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                  >
                    <div style={{ minWidth: '80px' }}>
                      <span
                        style={{
                          fontSize: '0.8em',
                          color: '#848484',
                        }}
                      >
                        {claim.member.memberId}
                      </span>
                    </div>
                    <div style={{ width: '100%' }}>
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
                  </div>
                </div>
              </TableColumn>
              <TableColumn>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span>{registrationDateString}</span>
                  <span style={{ fontSize: '0.8em', color: '#848484' }}>
                    {registrationDateTime}
                  </span>
                </div>
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
    </ListPage>
  )

  return (
    <ListPage>
      <FadeIn>
        <Header size="huge">Claims List</Header>
      </FadeIn>
      {loading && !claims ? (
        <LoadingMessage paddingTop={'25vh'} />
      ) : (
        <Spacing top={'small'}>
          <FadeIn delay={'200ms'}>
            <Paginator<Claim>
              currentPage={currentPage}
              totalPages={totalPages}
              onChangePage={(nextPage) =>
                history.push(`/claims/list/${nextPage + 1}`)
              }
              pagedItems={claims}
              itemContent={(claim, index) => (
                <ClaimListItem
                  index={index}
                  item={claim}
                  active={currentKeyboardNavigationStep === index}
                />
              )}
              tableHeader={
                <ClaimListHeader
                  onSort={(column, direction) => {
                    listClaims({
                      includeAll: true,
                      page: currentPage,
                      pageSize: 20,
                      sortBy: column,
                      sortDirection: direction,
                    })
                  }}
                />
              }
            />
          </FadeIn>
        </Spacing>
      )}
    </ListPage>
  )
}
