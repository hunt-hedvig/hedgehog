import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { getPageLimits } from 'components/shared/paginator/Paginator'
import React from 'react'
import { range } from 'utils/helpers'

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
