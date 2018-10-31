import { LinkRow } from 'components/shared'
import * as formatDate from 'date-fns/format'
import * as isValidDate from 'date-fns/is_valid'
import * as parseDate from 'date-fns/parse'
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
  const date = parseDate(item.date)
  const formattedDate = isValidDate(date)
    ? formatDate(date, 'DD MMMM YYYY HH:mm')
    : '-'
  return (
    <LinkRow onClick={() => linkClickHandler.bind(item.id, item.userId)}>
      <Table.Cell>{formattedDate}</Table.Cell>
      <Table.Cell>{item.type}</Table.Cell>
      <Table.Cell>{item.state}</Table.Cell>
      <Table.Cell>{item.reserve}</Table.Cell>
    </LinkRow>
  )
}

const BackendServedClaimsList: React.SFC<BackendServedClaimsListProps> = ({
  claims: { searchResult, searchFilter },
  claimsRequest,
}) => {
  const sortTable = (clickedColumn: ClaimSortColumn) => {
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

  const getTableHeader = () => {
    const { sortDirection, sortBy } = searchFilter
    const direction = sortDirection === 'DESC' ? 'descending' : 'ascending'
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell
            width={6}
            sorted={sortBy === 'DATE' ? direction : undefined}
            onClick={() => sortTable('DATE')}
          >
            Date
          </Table.HeaderCell>
          <Table.HeaderCell
            width={6}
            sorted={sortBy === 'TYPE' ? direction : undefined}
            onClick={() => sortTable('TYPE')}
          >
            Type
          </Table.HeaderCell>
          <Table.HeaderCell
            width={6}
            sorted={sortBy === 'STATE' ? direction : undefined}
            onClick={() => sortTable('STATE')}
          >
            State
          </Table.HeaderCell>
          <Table.HeaderCell
            width={6}
            sorted={sortBy === 'RESERVES' ? direction : undefined}
            onClick={() => sortTable('RESERVES')}
          >
            Reserves
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    )
  }

  const changePage = (page: number) => {
    claimsRequest({ ...searchFilter, page })
  }

  return (
    <BackendPaginatorList<Claim>
      pagedItems={searchResult.claims}
      itemContent={getTableRow}
      tableHeader={getTableHeader()}
      currentPage={searchResult.page}
      totalPages={searchResult.totalPages}
      isSortable={true}
      keyName="id"
      changePage={changePage}
    />
  )
}

export default BackendServedClaimsList
