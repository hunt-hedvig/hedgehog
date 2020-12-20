import { range } from 'lib/helpers'
import React from 'react'
import styled, { css } from 'react-emotion'
import { Button, Table } from 'semantic-ui-react'

interface BackendPageState {
  startPage: number
  endPage: number
}

const getPageLimits = (
  totalPages: number,
  currentPage: number,
): BackendPageState => {
  let start = currentPage - 3
  let end = currentPage + 4

  if (start < 0) {
    end += -start
  }

  if (end > totalPages) {
    start -= end - totalPages
  }

  start = Math.max(start, 0)
  end = Math.min(end, totalPages)

  return {
    startPage: start,
    endPage: end,
  }
}

const PaginatorContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;

  .buttons button.ui.button {
    ${({ theme }) => css`
      background: ${theme.defaultButtonBackground};
      color: ${theme.foreground};

      &.active {
        background: ${theme.highlightedButtonBackground};
      }
    `}
  }
`

export interface PaginatorProps<T> {
  pagedItems: T[]
  itemContent: (item: T, index: number) => React.ReactElement<any>
  tableHeader: React.ReactNode
  currentPage: number
  totalPages: number
  keyName?: keyof T
  onChangePage: (page: number) => void
}

export const Paginator = <T extends object>({
  onChangePage,
  currentPage,
  itemContent,
  keyName,
  pagedItems,
  tableHeader,
  totalPages,
}: PaginatorProps<T>) => {
  const { startPage, endPage } = getPageLimits(totalPages, currentPage)

  return (
    <>
      <Table celled selectable sortable>
        {tableHeader}
        {pagedItems.length && (
          <Table.Body>
            {pagedItems.map((item, index) => (
              <React.Fragment key={keyName ? '' + item[keyName] : index}>
                {itemContent(item, index)}
              </React.Fragment>
            ))}
          </Table.Body>
        )}
      </Table>
      <PaginatorContainer>
        {totalPages > 1 && (
          <Button.Group>
            <Button
              disabled={currentPage === 0}
              onClick={() => onChangePage(0)}
            >
              First
            </Button>
            {range(startPage, endPage).map((page, id) => (
              <Button
                key={id}
                className={currentPage === page ? 'active' : ''}
                onClick={() => onChangePage(page)}
              >
                {page + 1}
              </Button>
            ))}
            <Button
              disabled={currentPage === totalPages - 1}
              onClick={() => onChangePage(totalPages - 1)}
            >
              Last
            </Button>
          </Button.Group>
        )}
      </PaginatorContainer>
    </>
  )
}
