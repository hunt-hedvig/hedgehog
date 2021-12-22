import styled from '@emotion/styled'
import React from 'react'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'

const styles = `
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
  padding-left: 0;
}

.searchable-type-select__menu {
  border-radius: 0;
  hyphens: auto;
  margin-top: 0;
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
}`

export const SearchableDropdownWithRef = styled((props) => {
  if (props.creatable) {
    return (
      <CreatableSelect
        {...props}
        classNamePrefix="searchable-type-select"
        isSearchable={true}
      />
    )
  }

  return (
    <Select
      {...props}
      classNamePrefix="searchable-type-select"
      isSearchable={true}
    />
  )
})`
  ${styles}
`

export const SearchableDropdown = styled((props) =>
  props.creatable ? (
    <CreatableSelect
      {...props}
      classNamePrefix="searchable-type-select"
      isSearchable={true}
    />
  ) : (
    <Select
      {...props}
      classNamePrefix="searchable-type-select"
      isSearchable={true}
    />
  ),
)`
  ${styles}
`
