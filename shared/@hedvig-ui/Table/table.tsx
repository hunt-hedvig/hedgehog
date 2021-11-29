import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { useVerticalKeyboardNavigation } from '@hedvig-ui/hooks/keyboard/use-vertical-keyboard-navigation'
import React, { TableHTMLAttributes, useEffect, useRef } from 'react'
import { CaretUpFill } from 'react-bootstrap-icons'

const range = (start, end) =>
  start >= 0 && end >= start
    ? Array.from({ length: end - start }, (_v, k) => k + start)
    : []

export const Table = styled.table`
  border-collapse: collapse;
  font-weight: normal;
  text-align: left;
  width: 100%;
`

export const TableBody: React.FC<{
  onPerformNavigation?: (index) => void
  setActiveRow?: (n: number) => void
  isActive?: boolean
} & TableHTMLAttributes<HTMLTableSectionElement>> = ({
  onPerformNavigation,
  children,
  setActiveRow,
  isActive = true,
  ...props
}) => {
  const numberOfRows = React.Children.count(children)

  const [navigationStep] = useVerticalKeyboardNavigation({
    maxStep: numberOfRows - 1,
    onPerformNavigation: (index) => {
      if (onPerformNavigation) {
        onPerformNavigation(index)
      }
    },
    isActive: isActive && !!onPerformNavigation,
  })

  useEffect(() => {
    if (setActiveRow) {
      setActiveRow(navigationStep)
    }
  }, [navigationStep])

  return (
    <StyledTableBody
      activeRow={onPerformNavigation ? navigationStep : -1}
      {...props}
    >
      {children}
    </StyledTableBody>
  )
}

const StyledTableBody = styled.tbody<{ activeRow: number }>`
  border-collapse: collapse;
  font-weight: normal;
  text-align: left;
  width: 100%;

  ${({ activeRow, theme }) => {
    if (activeRow !== -1) {
      return css`
        tr:nth-of-type(${activeRow + 1}) td {
          background-color: ${theme.accentLight};
        }
      `
    }
  }}
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
  active?: boolean
  border?: boolean
}

export const TableRow: React.FC<TableRowProps> = ({ active, ...props }) => {
  const rowRef = useRef<HTMLTableRowElement>(null)

  useEffect(() => {
    if (active && rowRef && rowRef.current) {
      rowRef.current.focus()
    }
  }, [active])

  return <TableRowStyled ref={rowRef} active={active} {...props} />
}

export const TableHeader = ({ children }) => (
  <thead style={{ width: '100%' }}>
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
}> = ({ currentPage, totalPages, onSelect }) => {
  const { startPage, endPage } = getPageLimits(totalPages, currentPage)
  return (
    <PageSelectWrapper>
      <PageLink disabled={currentPage === 0} onClick={() => onSelect(1)}>
        First
      </PageLink>

      {range(startPage, endPage).map((page, id) => (
        <PageLink
          key={id}
          disabled={currentPage === page}
          onClick={() => {
            onSelect(page + 1)
          }}
        >
          {page + 1}
        </PageLink>
      ))}

      <PageLink
        disabled={currentPage === totalPages - 1}
        onClick={() => {
          onSelect(totalPages)
        }}
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
