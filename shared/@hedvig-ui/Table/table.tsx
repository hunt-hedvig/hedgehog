import { css } from '@emotion/react'
import styled from '@emotion/styled'
import chroma from 'chroma-js'
import React from 'react'
import { CaretUpFill } from 'react-bootstrap-icons'
import { useNavigation } from '../hooks/navigation/use-navigation'
import { lightTheme } from '../themes'

const range = (start: number, end: number) =>
  start >= 0 && end >= start
    ? Array.from({ length: end - start }, (_v, k) => k + start)
    : []

export const Table = styled.table`
  border-collapse: collapse;
  font-weight: normal;
  text-align: left;
  width: 100%;
`

export const TableBody = styled.tbody`
  border-collapse: collapse;
  font-weight: normal;
  text-align: left;
  width: 100%;
`

export const TableColumn = styled.td`
  padding: 0.9em 1em;
  font-size: 1.05em;
  transition: all 100ms;
  cursor: pointer;
`

const TableHeaderColumnStyled = styled.th<{ withSort?: boolean }>`
  position: relative;
  font-weight: lighter;
  color: ${({ theme }) => theme.semiStrongForeground};
  font-size: 0.8em;
  padding: 0.5em 1em 0.5em 1.2em;
  background-color: ${({ theme }) => theme.accentLight};
  cursor: ${({ withSort }) => (withSort ? 'pointer' : 'unset')};

  :first-of-type {
    border-radius: 8px 0 0 0;
  }

  :last-of-type {
    border-radius: 0 8px 0 0;
  }
`

const SortIcon = styled(CaretUpFill)<{ desc: number }>`
  position: absolute;
  right: 15px;
  top: 8px;
  transform: rotate(${({ desc }) => desc}deg);
`

interface TableHeaderColumnProps
  extends React.HTMLAttributes<HTMLTableHeaderCellElement> {
  withSort?: boolean
  sorting?: boolean
  desc?: boolean
}

export const TableHeaderColumn: React.FC<TableHeaderColumnProps> = ({
  sorting,
  withSort,
  desc,
  children,
  ...props
}) => {
  return (
    <TableHeaderColumnStyled withSort={withSort} {...props}>
      {children}
      {sorting && <SortIcon desc={desc ? 180 : 0} />}
    </TableHeaderColumnStyled>
  )
}

export const TableRowStyled = styled.tr<{ active?: boolean; border?: boolean }>`
  width: 100%;
  transition: all 150ms;
  outline: none;

  &:not(:last-of-type) {
    border-bottom: ${({ border, theme }) =>
      border ? `1px solid ${theme.border}` : 'none'};
  }
  :hover {
    cursor: pointer;

    &,
    & td {
      background-color: ${({ theme }) => theme.accentSaturated};
    }
  }

  :focus {
    &,
    & td {
      background-color: ${({ theme }) => theme.accentLight};
    }
  }

  &,
  & td {
    background-color: ${({ theme, active }) =>
      active ? theme.accentLight : theme.accentLighter};
  }

  :last-of-type {
    border-radius: 0 0 8px 8px;

    td:first-of-type {
      border-radius: 0 0 0 8px;
    }

    td:last-of-type {
      border-radius: 0 0 8px 0;
    }
  }
`

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  index?: number
  length?: number
  id?: string
  onResolve?: (idx: number) => void
  border?: boolean
  active?: boolean
  topElement?: string
}

export const TableRow: React.FC<TableRowProps> = ({
  index,
  length,
  onResolve,
  topElement,
  id,
  ...props
}) => {
  const { register } = useNavigation()

  const rowNavigation =
    typeof index === 'number' && typeof length === 'number' && onResolve
      ? register(
          `Table Row ${id ?? index}`,
          {
            autoFocus: index === 0,
            resolve: () => {
              if (!onResolve) {
                return
              }

              onResolve(index)
            },
            neighbors: {
              up: index > 0 ? `Table Row ${index - 1}` : topElement,
              down:
                index < length - 1
                  ? `Table Row ${index + 1}`
                  : 'Table Pagination 0',
            },
          },
          {
            background: `${chroma(lightTheme.accent).brighten(1).hex()}`,
            border: 'none',
          },
          {
            border: 'none',
          },
        )
      : null

  return <TableRowStyled {...rowNavigation} {...props} />
}

export const TableHeader: React.FC<
  React.HTMLAttributes<HTMLTableSectionElement>
> = ({ children, ...props }) => (
  <thead style={{ width: '100%' }} {...props}>
    <tr style={{ width: '100%' }}>{children}</tr>
  </thead>
)

const PageLink = styled.span<{ disabled: boolean }>`
  cursor: ${({ disabled }) => (disabled ? 'default' : 'pointer')};
  padding: 0 1em;
  color: ${({ theme, disabled }) =>
    disabled ? theme.placeholderColor : theme.accent};
  transition: all 100ms;

  ${({ theme, disabled }) => {
    return (
      !disabled &&
      css`
        :hover {
          color: ${theme.accentLight};
        }
      `
    )
  }}
`

const PageSelectWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 1em;
`

export const TablePageSelect: React.FC<{
  currentPage: number
  totalPages: number
  onSelect: (page: number) => void
  rowCount: number
}> = ({ currentPage, totalPages, onSelect, rowCount }) => {
  const { startPage, endPage } = getPageLimits(totalPages, currentPage)
  const { register } = useNavigation()

  return (
    <PageSelectWrapper>
      <PageLink
        disabled={currentPage === 0}
        onClick={() => onSelect(1)}
        {...register(`Table Pagination 0`, {
          resolve: () => {
            if (currentPage === 0) {
              return
            }
            onSelect(1)
          },
          neighbors: {
            up: `Table Row ${rowCount - 1}`,
            right: 'Table Pagination 1',
          },
        })}
      >
        First
      </PageLink>

      {range(startPage, endPage).map((page, id) => {
        const pagination = register(`Table Pagination ${id + 1}`, {
          resolve: () => {
            if (currentPage === page) {
              return
            }

            onSelect(page + 1)
          },
          neighbors: {
            up: `Table Row ${rowCount - 1}`,
            left: id >= 0 ? `Table Pagination ${id}` : undefined,
            right: `Table Pagination ${id + 2}`,
          },
        })

        return (
          <PageLink
            style={{ ...pagination.style }}
            key={id}
            disabled={currentPage === page}
            onClick={() => {
              onSelect(page + 1)
            }}
          >
            {page + 1}
          </PageLink>
        )
      })}

      <PageLink
        disabled={currentPage === totalPages - 1}
        onClick={() => {
          onSelect(totalPages)
        }}
        {...register(
          `Table Pagination ${range(startPage, endPage).length + 1}`,
          {
            resolve: () => {
              if (currentPage === totalPages - 1) {
                return
              }

              onSelect(totalPages)
            },
            neighbors: {
              up: `Table Row ${rowCount - 1}`,
              left: `Table Pagination ${range(startPage, endPage).length}`,
            },
          },
        )}
      >
        Last
      </PageLink>
    </PageSelectWrapper>
  )
}

interface PageState {
  startPage: number
  endPage: number
}

const getPageLimits = (totalPages: number, currentPage: number): PageState => {
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
