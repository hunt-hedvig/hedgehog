import { getBackendPageState } from 'lib/paginator'
import * as React from 'react'
import { Button } from 'semantic-ui-react'
import styled from 'styled-components'
import { range } from '../../../lib/helpers'

const Paginator = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`

export interface BackendPaginationProps {
  totalPages: number
  currentPage: number
  changePage: (page: number) => void
}

export default class BackendPagination extends React.Component<
  BackendPaginationProps
> {
  constructor(props: BackendPaginationProps) {
    super(props)
  }

  public render() {
    const { totalPages, currentPage, changePage } = this.props
    const pageState = getBackendPageState(totalPages, currentPage)

    return (
      <Paginator>
        {totalPages > 1 && (
          <Button.Group>
            <Button
              disabled={pageState.currentPage === 0}
              onClick={() => changePage(0)}
            >
              First
            </Button>
            {range(pageState.startPage, pageState.endPage).map((page, id) => (
              <Button
                key={id}
                className={pageState.currentPage === page ? 'active' : ''}
                onClick={() => changePage(page)}
              >
                {page + 1}
              </Button>
            ))}
            <Button
              disabled={pageState.currentPage === pageState.totalPages - 1}
              onClick={() => changePage(pageState.totalPages - 1)}
            >
              Last
            </Button>
          </Button.Group>
        )}
      </Paginator>
    )
  }
}
