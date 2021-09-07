import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { getPageLimits } from 'components/shared/paginator/Paginator'
import React from 'react'
import { range } from 'utils/helpers'

export const Table = styled.table`
  margin-top: 2em;
  font-weight: normal;
  text-align: left;
  width: 100%;
  border-collapse: collapse;
`

export const TableColumn = styled.td`
  padding: 1.6em 1em;
  font-size: 1.05em;
  transition: all 100ms;
  :hover {
    cursor: pointer;
  }
`

export const TableHeader = styled.th`
  font-weight: lighter;
  color: ${({ theme }) => theme.semiStrongForeground};
  font-size: 0.8em;
  padding: 0.5em 1em 0.5em 1.2em;
  background-color: ${({ theme }) => theme.accentLight};

  :first-child {
    border-radius: 8px 0 0 0;
  }

  :last-child {
    border-radius: 0 8px 0 0;
  }
`

export const TableRow = styled.tr<{ active?: boolean }>`
  width: 100%;
  transition: all 150ms;

  :hover {
    background-color: ${({ theme }) => theme.accentLight};
  }
  background-color: ${({ theme, active }) =>
    active ? theme.accentLight : theme.accentLighter};
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

export const PageSelect: React.FC<{
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
