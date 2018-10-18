import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Table } from 'semantic-ui-react'
import styled from 'styled-components'
import Pagination from '../pagination/Pagination'

const PaginatorContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`

export default class PaginatorList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeList: [],
    }
  }

  public onChangePage = (activeList) => {
    this.setState({ activeList })
  }

  public render() {
    const { activeList } = this.state
    const {
      list,
      itemContent,
      pageSize,
      tableHeader,
      isSortable,
      keyName,
    } = this.props
    return (
      <React.Fragment>
        <Table celled selectable sortable={isSortable ? true : false}>
          {tableHeader}
          {activeList.length ? (
            <Table.Body>
              {activeList.map((item, key) => (
                <React.Fragment key={keyName ? item[keyName] : key}>
                  {itemContent(item)}
                </React.Fragment>
              ))}
            </Table.Body>
          ) : null}
        </Table>
        <PaginatorContainer>
          <Pagination
            items={list}
            onChangePage={this.onChangePage}
            pageSize={pageSize || 6}
          />
        </PaginatorContainer>
      </React.Fragment>
    )
  }
}

PaginatorList.propTypes = {
  list: PropTypes.array.isRequired,
  itemContent: PropTypes.func.isRequired,
  tableHeader: PropTypes.object,
  pageSize: PropTypes.number,
  isSortable: PropTypes.bool,
  keyName: PropTypes.string,
}
