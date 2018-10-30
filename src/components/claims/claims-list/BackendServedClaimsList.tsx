import { LinkRow } from 'components/shared'
import * as moment from 'moment'
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

const BackendServedClaimsList = ({
  claims: { searchResult, searchFilter },
  claimsRequest,
}: BackendServedClaimsListProps) => {
  const linkClickHandler = (id: string, userId: string) => {
    history.push(`/claims/${id}/members/${userId}`)
  }

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

  const getTableRow = (item: Claim) => {
    const date = moment(item.date).local()
    const formattedDate = date.isValid()
      ? date.format('DD MMMM YYYY HH:mm')
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
