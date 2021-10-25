import { css } from '@emotion/react'
import styled from '@emotion/styled'
import React, { TableHTMLAttributes } from 'react'
import { range } from '../utils/helpers'
import { useVerticalKeyboardNavigation } from '../utils/keyboard-actions'

export const Table: React.FC<{
  onPerformNavigation?: (index) => void
} & TableHTMLAttributes<HTMLTableElement>> = ({
  onPerformNavigation,
  children,
  ...props
}) => {
  const numberOfRows = React.Children.count(children)

  const [navigationStep] = useVerticalKeyboardNavigation({
    maxStep: numberOfRows - 2,
    onPerformNavigation: (index) => {
      if (onPerformNavigation) {
        onPerformNavigation(index)
      }
    },
  })

  return (
    <StyledTable
      activeRow={onPerformNavigation ? navigationStep : -1}
      {...props}
    >
      {children}
    </StyledTable>
  )
}

const StyledTable = styled.table<{ activeRow: number }>`
  font-weight: normal;
  text-align: left;
  width: 100%;
  border-collapse: collapse;

  ${({ activeRow, theme }) => {
    if (activeRow !== -1) {
      return css`
        tr:nth-of-type(${activeRow + 2}) {
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

export const TableHeaderColumn = styled.th`
  font-weight: lighter;
  color: ${({ theme }) => theme.semiStrongForeground};
  font-size: 0.8em;
  padding: 0.5em 1em 0.5em 1.2em;
  background-color: ${({ theme }) => theme.accentLight};

  :first-of-type {
    border-radius: 8px 0 0 0;
  }

  :last-of-type {
    border-radius: 0 8px 0 0;
  }
`

export const TableRow = styled.tr<{ active?: boolean; border?: boolean }>`
  width: 100%;
  transition: all 150ms;

  &:not(:last-of-type) {
    border-bottom: ${({ border, theme }) =>
      border ? `1px solid ${theme.border}` : 'none'};
  }
  :hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.accentSaturated};
  }

  :focus {
    background-color: ${({ theme }) => theme.accentLight};
  }

  background-color: ${({ theme, active }) =>
    active ? theme.accentLight : theme.accentLighter};

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

export const TableHeader = styled.tr`
  width: 100%;
`

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
          onSelect(totalPages - 1)
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
