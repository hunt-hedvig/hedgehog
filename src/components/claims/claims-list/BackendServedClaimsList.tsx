import { LinkRow } from 'components/shared'
import formatDate from 'date-fns/format'
import isValidDate from 'date-fns/isValid'
import toDate from 'date-fns/toDate'
import * as React from 'react'
import { Table } from 'semantic-ui-react'
import { history } from 'store'
import {
  Claim,
  ClaimSearchFilter,
  ClaimSortColumn,
  ClaimsStore,
} from '../../../store/types/claimsTypes'
import BackendPaginatorList from '../../shared/paginator-list/BackendPaginatorList'

export interface BackendServedClaimsListProps {
  claims: ClaimsStore
  claimsRequest: (filter: ClaimSearchFilter) => void
}

const linkClickHandler = (id: string, userId: string) => {
  history.push(`/claims/${id}/members/${userId}`)
}

const getTableRow = (item: Claim) => {
  const date = toDate(item.date)
  const formattedDate = isValidDate(date)
    ? formatDate(date, 'dd MMMM yyyy HH:mm')
    : '-'
  return (
    <LinkRow onClick={() => linkClickHandler(item.id, item.userId)}>
      <Table.Cell>{formattedDate}</Table.Cell>
      <Table.Cell>{item.type}</Table.Cell>
      <Table.Cell>{item.state}</Table.Cell>
      <Table.Cell>{item.reserve}</Table.Cell>
    </LinkRow>
  )
}

const sortTable = (
  clickedColumn: ClaimSortColumn,
  searchFilter: ClaimSearchFilter,
  claimsRequest: (filter: ClaimSearchFilter) => void,
) => {
  if (searchFilter.sortBy !== clickedColumn) {
    claimsRequest({ ...searchFilter, sortBy: clickedColumn, page: 0 })
  } else {
    claimsRequest({
      ...searchFilter,
      sortDirection: searchFilter.sortDirection === 'DESC' ? 'ASC' : 'DESC',
      page: 0,
    })
  }
}

const getTableHeader = (
  searchFilter: ClaimSearchFilter,
  claimsRequest: (filter: ClaimSearchFilter) => void,
) => {
  const { sortDirection, sortBy } = searchFilter
  const direction = sortDirection === 'DESC' ? 'descending' : 'ascending'
  return (
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell
          width={6}
          sorted={sortBy === 'DATE' ? direction : undefined}
          onClick={() => sortTable('DATE', searchFilter, claimsRequest)}
        >
          Date
        </Table.HeaderCell>
        <Table.HeaderCell
          width={6}
          sorted={sortBy === 'TYPE' ? direction : undefined}
          onClick={() => sortTable('TYPE', searchFilter, claimsRequest)}
        >
          Type
        </Table.HeaderCell>
        <Table.HeaderCell
          width={6}
          sorted={sortBy === 'STATE' ? direction : undefined}
          onClick={() => sortTable('STATE', searchFilter, claimsRequest)}
        >
          State
        </Table.HeaderCell>
        <Table.HeaderCell
          width={6}
          sorted={sortBy === 'RESERVES' ? direction : undefined}
          onClick={() => sortTable('RESERVES', searchFilter, claimsRequest)}
        >
          Reserves
        </Table.HeaderCell>
      </Table.Row>
    </Table.Header>
  )
}

const BackendServedClaimsList: React.SFC<BackendServedClaimsListProps> = ({
  claims: { searchResult, searchFilter },
  claimsRequest,
}) => (
  <BackendPaginatorList<Claim>
    pagedItems={searchResult.claims}
    itemContent={getTableRow}
    tableHeader={getTableHeader(searchFilter, claimsRequest)}
    currentPage={searchResult.page}
    totalPages={searchResult.totalPages}
    isSortable={true}
    keyName="id"
    changePage={(page) => claimsRequest({ ...searchFilter, page })}
  />
)

export default BackendServedClaimsList
