import styled from '@emotion/styled'
import React, { useEffect, useRef } from 'react'
import Select from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { sleep } from 'utils/sleep'

const styles = `.searchable-type-select__control {
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
  const selectRef = useRef<any>()

  useEffect(() => {
    const focus = async () => {
      if (props.focus && selectRef.current) {
        await sleep(1)
        selectRef.current.focus()
      }
    }

    focus()
  }, [props.focus])

  if (props.creatable) {
    return (
      <CreatableSelect
        {...props}
        classNamePrefix="searchable-type-select"
        isSearchable={true}
        ref={(ref) => (selectRef.current = ref)}
      />
    )
  }

  return (
    <Select
      {...props}
      classNamePrefix="searchable-type-select"
      isSearchable={true}
      ref={(ref) => (selectRef.current = ref)}
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
