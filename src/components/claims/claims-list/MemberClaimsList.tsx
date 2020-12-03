import { LinkRow } from 'components/shared'
import PaginatorList from 'components/shared/paginator-list/PaginatorList'
import { format, parseISO } from 'date-fns'
import { useGetMemberClaims } from 'graphql/use-get-member-claims'
import {
  LoadingMessage,
  StandaloneMessage,
} from 'hedvig-ui/animations/standalone-message'
import React from 'react'
import { Table } from 'semantic-ui-react'
import { history } from 'store'
import { formatMoney } from 'utils/money'

const linkClickHandler = (claimId: string, memberId: string) => {
  history.push(`/claims/${claimId}/members/${memberId}`)
}

type SortDirection = 'ascending' | 'descending'

export const MemberClaimsList: React.FC<{ memberId: string }> = ({
  memberId,
}) => {
  const [claims, { loading }] = useGetMemberClaims(memberId)
  const [column, setColumn] = React.useState<string | null>(null)
  const [direction, setDirection] = React.useState<SortDirection>()

  if (loading || !claims) {
    return <LoadingMessage paddingTop="25vh" />
  }

  if (claims.length === 0) {
    return (
      <StandaloneMessage paddingTop="10vh">
        Claims list is empty
      </StandaloneMessage>
    )
  }

  const sortTable = (clickedColumn: string) => {
    if (column !== clickedColumn) {
      setColumn(clickedColumn)
      setDirection('ascending')
      return
    }

    setDirection(flippedDirection(direction))
  }

  const flippedDirection = (d?: SortDirection) => {
    if (!d) {
      return 'descending'
    }
    return d === 'ascending' ? 'descending' : 'ascending'
  }

  return (
    <PaginatorList
      list={claims}
      itemContent={(claim) => {
        const formattedDate = format(
          parseISO(claim.registrationDate),
          'dd MMMM yyyy hh:mm',
        )
        return (
          <LinkRow onClick={() => linkClickHandler(claim.id, memberId)}>
            <Table.Cell>{formattedDate}</Table.Cell>
            <Table.Cell>{claim.type?.__typename}</Table.Cell>
            <Table.Cell>{claim.state}</Table.Cell>
            <Table.Cell>
              {claim.reserves && formatMoney(claim.reserves)}
            </Table.Cell>
          </LinkRow>
        )
      }}
      tableHeader={
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell
              width={6}
              sorted={
                column === 'date' ? direction : flippedDirection(direction)
              }
              onClick={() => sortTable('date')}
            >
              Date
            </Table.HeaderCell>
            <Table.HeaderCell
              width={6}
              sorted={
                column === 'type' ? direction : flippedDirection(direction)
              }
              onClick={() => sortTable('type')}
            >
              Type
            </Table.HeaderCell>
            <Table.HeaderCell
              width={6}
              sorted={
                column === 'state' ? direction : flippedDirection(direction)
              }
              onClick={() => sortTable('state')}
            >
              State
            </Table.HeaderCell>
            <Table.HeaderCell
              width={6}
              sorted={
                column === 'reserve' ? direction : flippedDirection(direction)
              }
              onClick={() => sortTable('reserve')}
            >
              Reserves
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
      }
      pageSize={20}
      isSortable={true}
      keyName="id"
    />
  )
}
