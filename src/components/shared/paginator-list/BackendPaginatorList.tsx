import * as React from 'react'
import { Table } from 'semantic-ui-react'
import styled from 'styled-components'
import { Member } from '../../../store/storeTypes'
import BackendPagination from '../pagination/BackendPagination'

const PaginatorContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`

export interface BackendPaginatorListProps {
  pagedItems: Member[]
  itemContent: (item: Member) => React.ReactElement<any>
  tableHeader: React.ReactElement<any>
  currentPage: number
  totalPages: number
  isSortable: boolean
  keyName: keyof Member
  changePage: (page: number) => void
}

export default class BackendPaginatorList extends React.Component<
  BackendPaginatorListProps
> {
  constructor(props: BackendPaginatorListProps) {
    super(props)
  }

  public render() {
    const {
      pagedItems,
      itemContent,
      currentPage,
      totalPages,
      tableHeader,
      isSortable,
      keyName,
      changePage,
    } = this.props
    return (
      <React.Fragment>
        <Table celled selectable sortable={isSortable ? true : false}>
          {tableHeader}
          {pagedItems.length ? (
            <Table.Body>
              {pagedItems.map((item, key) => (
                <React.Fragment key={keyName ? item[keyName] : key}>
                  {itemContent(item)}
                </React.Fragment>
              ))}
            </Table.Body>
          ) : null}
        </Table>
        <PaginatorContainer>
          <BackendPagination
            currentPage={currentPage}
            totalPages={totalPages}
            changePage={changePage}
          />
        </PaginatorContainer>
      </React.Fragment>
    )
  }
}
