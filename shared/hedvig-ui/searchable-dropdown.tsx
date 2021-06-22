import styled from '@emotion/styled'
import React from 'react'
import Select from 'react-select'

export const SearchableDropdown = styled((props) => (
  <Select
    {...props}
    classNamePrefix="searchable-type-select"
    isSearchable={true}
  />
))`
  .searchable-type-select__control {
    border-radius: 7px;
    height: 44px;
    box-shadow: none;
    background-color: ${({ theme }) => theme.backgroundLight};
    border: 1px solid ${({ theme }) => theme.border};
    font-size: 1rem;
  }

  .searchable-type-select__input {
    color: ${({ theme }) => theme.foreground};
    padding-left: 0px;
  }

  .searchable-type-select__menu {
    border-radius: 0;
    hyphens: auto;
    margin-top: 0px;
    text-align: left;
    word-wrap: break-word;
    background: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.foreground};
  }

  .searchable-type-select__option {
    &:hover {
      background: ${({ theme }) => theme.accentBackground};
    }
  }

  .searchable-type-select__value-container {
    padding-left: 16px;
    overflow: visible;
  }

  .searchable-type-select__multi-value__remove {
    display: none;
  }

  .searchable-type-select__single-value {
    color: ${({ theme }) => theme.foreground};
  }
`
