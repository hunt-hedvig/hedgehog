import { LinkRow } from 'components/shared'
import * as formatDate from 'date-fns/format'
import * as isValidDate from 'date-fns/is_valid'
import * as parse from 'date-fns/parse'
import * as React from 'react'
import { Table } from 'semantic-ui-react'
import { history } from 'store'
import {
  MemberInsurance,
  MemberInsuranceSearchRequest,
  MemberInsuranceStore,
  ProductSortColumns,
} from '../../../store/types/memberInsuranceTypes'
import BackendPaginatorList from '../../shared/paginator-list/BackendPaginatorList'

export interface MemberInsuranceListProps {
  memberInsurance: MemberInsuranceStore
  searchMemberInsRequest: (req: Partial<MemberInsuranceSearchRequest>) => void
}

const getMemberName = (ins: MemberInsurance) =>
  ins.memberFirstName
    ? `${ins.memberFirstName} ${ins.memberLastName || ''}`
    : `${ins.memberId ? 'Member-' + ins.memberId : 'No id'}`

const linkClickHandler = (id) => {
  history.push(`/members/${id}`, { to: 'insurance' })
}

const getFormattedDate = (date) => {
  return isValidDate(date) ? formatDate(date, 'DD MMMM YYYY') : '-'
}

const getTableRow = (item: MemberInsurance) => {
  // FIXME : we need to remove Z after insuranceActiveFrom and insuranceActiveTo when we will change the type of datetime from backend.
  const activationDate = parse(item.insuranceActiveFrom + 'Z')
  const cancellationDate = parse(item.insuranceActiveTo + 'Z')
  const signedOnDate = parse(item.signedOn)

  return (
    <LinkRow onClick={() => linkClickHandler(item.memberId)}>
      <Table.Cell>{getMemberName(item)}</Table.Cell>
      <Table.Cell>{item.insuranceType}</Table.Cell>
      <Table.Cell>{getFormattedDate(signedOnDate)}</Table.Cell>
      <Table.Cell>{getFormattedDate(activationDate)}</Table.Cell>
      <Table.Cell>{getFormattedDate(cancellationDate)}</Table.Cell>
      <Table.Cell>{item.insuranceStatus}</Table.Cell>
      <Table.Cell>
        {item.cancellationEmailSent
          ? item.cancellationEmailSent.toString()
          : '-'}
      </Table.Cell>
      <Table.Cell>
        {item.certificateUploaded ? item.certificateUploaded.toString() : '-'}
      </Table.Cell>
      <Table.Cell>
        {item.personsInHouseHold ? item.personsInHouseHold.toString() : '-'}
      </Table.Cell>
    </LinkRow>
  )
}

const sortTable = (
  sortBy: ProductSortColumns,
  searchFilter: MemberInsuranceSearchRequest,
  doSearch: (req: Partial<MemberInsuranceSearchRequest>) => void,
) => {
  if (searchFilter.sortBy !== sortBy) {
    doSearch({ sortBy, sortDirection: 'ASC', page: 0 })
  } else {
    doSearch({
      sortDirection: searchFilter.sortDirection === 'ASC' ? 'DESC' : 'ASC',
      page: 0,
    })
  }
}

const getTableHeader = (
  searchFilter: MemberInsuranceSearchRequest,
  doSearch: (req: Partial<MemberInsuranceSearchRequest>) => void,
) => {
  const { sortBy, sortDirection } = searchFilter
  const direction = sortDirection === 'ASC' ? 'ascending' : 'descending'
  return (
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell
          width={4}
          sorted={sortBy === 'MEMBER_FULL_NAME' ? direction : undefined}
          onClick={() => sortTable('MEMBER_FULL_NAME', searchFilter, doSearch)}
        >
          Member fullname
        </Table.HeaderCell>
        <Table.HeaderCell
          width={2}
          sorted={sortBy === 'TYPE' ? direction : undefined}
          onClick={() => sortTable('TYPE', searchFilter, doSearch)}
        >
          Type
        </Table.HeaderCell>
        <Table.HeaderCell
          width={3}
          sorted={sortBy === 'CONTRACT_SIGNED_DATE' ? direction : undefined}
          onClick={() =>
            sortTable('CONTRACT_SIGNED_DATE', searchFilter, doSearch)
          }
        >
          Sign up
        </Table.HeaderCell>
        <Table.HeaderCell
          width={3}
          sorted={sortBy === 'ACTIVE_FROM_DATE' ? direction : undefined}
          onClick={() => sortTable('ACTIVE_FROM_DATE', searchFilter, doSearch)}
        >
          Active from
        </Table.HeaderCell>
        <Table.HeaderCell
          width={3}
          sorted={sortBy === 'ACTIVE_TO_DATE' ? direction : undefined}
          onClick={() => sortTable('ACTIVE_TO_DATE', searchFilter, doSearch)}
        >
          Active to
        </Table.HeaderCell>
        <Table.HeaderCell
          width={2}
          sorted={sortBy === 'STATUS' ? direction : undefined}
          onClick={() => sortTable('STATUS', searchFilter, doSearch)}
        >
          Status
        </Table.HeaderCell>
        <Table.HeaderCell
          width={1}
          sorted={
            sortBy === 'CANCELLATION_EMAIL_SENT_DATE' ? direction : undefined
          }
          onClick={() =>
            sortTable('CANCELLATION_EMAIL_SENT_DATE', searchFilter, doSearch)
          }
        >
          Cancellation
          <br />
          email sent
        </Table.HeaderCell>
        <Table.HeaderCell
          width={1}
          sorted={sortBy === 'CERTIFICATE_UPLOADED' ? direction : undefined}
          onClick={() =>
            sortTable('CERTIFICATE_UPLOADED', searchFilter, doSearch)
          }
        >
          Certificate
          <br />
          uploaded
        </Table.HeaderCell>
        <Table.HeaderCell
          width={1}
          sorted={sortBy === 'HOUSEHOLD_SIZE' ? direction : undefined}
          onClick={() => sortTable('HOUSEHOLD_SIZE', searchFilter, doSearch)}
        >
          Household
          <br />
          size
        </Table.HeaderCell>
      </Table.Row>
    </Table.Header>
  )
}

const MemberInsuranceList: React.SFC<MemberInsuranceListProps> = ({
  memberInsurance: { searchFilter, searchResult },
  searchMemberInsRequest,
}) => (
  <BackendPaginatorList<MemberInsurance>
    pagedItems={searchResult.products}
    currentPage={searchResult.page}
    totalPages={searchResult.totalPages}
    changePage={(page: number) => searchMemberInsRequest({ page })}
    itemContent={getTableRow}
    tableHeader={getTableHeader(searchFilter, searchMemberInsRequest)}
    isSortable={true}
    keyName="productId"
  />
)

export default MemberInsuranceList
