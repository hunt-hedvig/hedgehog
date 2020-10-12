import React from 'react'
import styled from 'react-emotion'
import { Table } from 'semantic-ui-react'
import BackendPagination from '../pagination/BackendPagination'

const PaginatorContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`

export interface BackendPaginatorListProps<T> {
  pagedItems: T[]
  itemContent: (
    item: T,
    isKeyboardHighlighted: boolean,
  ) => React.ReactElement<any>
  tableHeader: React.ReactNode
  currentPage: number
  totalPages: number
  isSortable: boolean
  keyName?: keyof T
  changePage: (page: number) => void
  keyboardNavigationActive?: boolean
  onKeyboardNavigation?: () => void
  onKeyboardSelect?: (index: number) => void
}

export default class BackendPaginatorList<T> extends React.Component<
  BackendPaginatorListProps<T>,
  { keyboardPaginationIndex: number }
> {
  state = { keyboardPaginationIndex: -1 }

  componentDidUpdate(prevProps: Readonly<BackendPaginatorListProps<T>>) {
    if (
      this.props.keyboardNavigationActive &&
      !prevProps.keyboardNavigationActive
    ) {
      this.setState({ keyboardPaginationIndex: -1 })
    }

    if (this.props.pagedItems.length < this.state.keyboardPaginationIndex) {
      this.setState({
        keyboardPaginationIndex: this.props.pagedItems.length - 1,
      })
    }
  }

  componentDidMount() {
    window.addEventListener('keydown', this.eventListener)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.eventListener)
  }

  eventListener = (e: KeyboardEvent) => {
    if (!this.props.keyboardNavigationActive) {
      return
    }

    if (e.key === 'Enter' && this.props.onKeyboardSelect) {
      e.preventDefault()
      this.props.onKeyboardSelect(this.state.keyboardPaginationIndex)
    }

    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      if (this.props.onKeyboardNavigation) {
        this.props.onKeyboardNavigation()
      }
    }

    this.setState((prevState) => {
      if (e.key === 'ArrowUp' && prevState.keyboardPaginationIndex > 0) {
        return {
          keyboardPaginationIndex: prevState.keyboardPaginationIndex - 1,
        }
      } else if (
        e.key === 'ArrowDown' &&
        prevState.keyboardPaginationIndex < this.props.pagedItems.length - 1
      ) {
        return {
          keyboardPaginationIndex: prevState.keyboardPaginationIndex + 1,
        }
      } else {
        return {
          keyboardPaginationIndex: prevState.keyboardPaginationIndex,
        }
      }
    })
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
        <Table celled selectable sortable={isSortable}>
          {tableHeader}
          {pagedItems.length ? (
            <Table.Body>
              {pagedItems.map((item, index) => (
                <React.Fragment key={keyName ? '' + item[keyName] : index}>
                  {itemContent(
                    item,
                    this.state.keyboardPaginationIndex === index,
                  )}
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
