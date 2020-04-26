import * as React from 'react'
import { components } from 'react-select'

export const SelectItemCategoriesPlaceholder = (props) => {
  const [selectedOptions, rawInput] = props.children
  const showPlaceholder =
    !props.selectProps.menuIsOpen || rawInput.props.value === ''

  return (
    <components.ValueContainer {...props}>
      {selectedOptions}
      {rawInput}
      {showPlaceholder && (
        <div style={{ color: '#919191' }}>{props.selectProps.placeholder}</div>
      )}
    </components.ValueContainer>
  )
}
