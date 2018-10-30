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

export default class BackendServedClaimsList extends React.Component<
  BackendServedClaimsListProps
> {
  constructor(props: BackendServedClaimsListProps) {
    super(props)
  }

  public linkClickHandler = (id: string, userId: string) => {
    history.push(`/claims/${id}/members/${userId}`)
  }

  public sortTable = (clickedColumn: ClaimSortColumn) => {
    const {
      claims: { searchFilter },
      claimsRequest,
    } = this.props

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

  public getTableHeader = () => {
    const {
      claims: {
        searchFilter: { sortBy, sortDirection },
      },
    } = this.props
    const direction = sortDirection === 'DESC' ? 'descending' : 'ascending'
    return (
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell
            width={6}
            sorted={sortBy === 'DATE' ? direction : undefined}
            onClick={this.sortTable.bind(this, 'DATE')}
          >
            Date
          </Table.HeaderCell>
          <Table.HeaderCell
            width={6}
            sorted={sortBy === 'TYPE' ? direction : undefined}
            onClick={this.sortTable.bind(this, 'TYPE')}
          >
            Type
          </Table.HeaderCell>
          <Table.HeaderCell
            width={6}
            sorted={sortBy === 'STATE' ? direction : undefined}
            onClick={this.sortTable.bind(this, 'STATE')}
          >
            State
          </Table.HeaderCell>
          <Table.HeaderCell
            width={6}
            sorted={sortBy === 'RESERVES' ? direction : undefined}
            onClick={this.sortTable.bind(this, 'RESERVES')}
          >
            Reserves
          </Table.HeaderCell>
        </Table.Row>
      </Table.Header>
    )
  }

  public getTableRow = (item: Claim) => {
    const date = moment(item.date).local()
    const formattedDate = date.isValid()
      ? date.format('DD MMMM YYYY HH:mm')
      : '-'
    return (
      <LinkRow onClick={this.linkClickHandler.bind(this, item.id, item.userId)}>
        <Table.Cell>{formattedDate}</Table.Cell>
        <Table.Cell>{item.type}</Table.Cell>
        <Table.Cell>{item.state}</Table.Cell>
        <Table.Cell>{item.reserve}</Table.Cell>
      </LinkRow>
    )
  }

  public changePage = (page: number) => {
    const {
      claimsRequest,
      claims: { searchFilter },
    } = this.props
    claimsRequest({ ...searchFilter, page })
  }

  public render() {
    const {
      claims: { searchResult },
    } = this.props
    return (
      <BackendPaginatorList<Claim>
        pagedItems={searchResult.claims}
        itemContent={this.getTableRow}
        tableHeader={this.getTableHeader()}
        currentPage={searchResult.page}
        totalPages={searchResult.totalPages}
        isSortable={true}
        keyName="id"
        changePage={this.changePage}
      />
    )
  }
}
