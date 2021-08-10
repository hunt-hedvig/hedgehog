import styled from '@emotion/styled'
import React, { useState } from 'react'
import {
  Dropdown as SemanticDropdown,
  DropdownItemProps,
} from 'semantic-ui-react'

const StyledDropdown = styled(SemanticDropdown)({
  width: '100%',
})

interface DropdownValue {
  key?: string
  value: string
  text: string
}

export const Dropdown: React.FC<{
  options: DropdownValue[] | string[]
  onChange: (value: string) => void
  value: string
}> = ({ options, onChange, value, ...props }) => {
  const getOptions = (): DropdownValue[] =>
    Object(options).map((option) => {
      if (typeof option === 'string') {
        return {
          key: option + new Date().toString(),
          value: option,
          text: option,
        }
      }

      return option
    })

  return (
    <StyledDropdown
      value={value}
      onChange={(_, { value: selection }) => onChange(selection as string)}
      options={getOptions()}
      selection
      {...props}
    />
  )
}

export const EnumDropdown: React.FC<{
  value?: any
  enumToSelectFrom: any
  placeholder: string
  setValue: (value: any) => void
  loading?: boolean
}> = ({ enumToSelectFrom, placeholder, setValue, value, loading }) => {
  const [autoLoading, setAutoLoading] = useState(false)
  const dropdownOptions: DropdownItemProps[] = Object.values(
    enumToSelectFrom,
  ).map((selection, index) => {
    if (typeof value === 'number') {
      throw new Error(
        `EnumDropdown does not support enums with ordinal values (yet), enumToSelectFrom: ${JSON.stringify(
          enumToSelectFrom,
        )}`,
      )
    }
    return {
      key: index + 1,
      value: selection as string,
      text: getTextFromEnumValue(selection as string),
    }
  })

  return (
    <StyledDropdown
      value={value}
      placeholder={placeholder}
      options={dropdownOptions}
      loading={loading ?? autoLoading}
      selection
      onChange={async (_, { value: selection }) => {
        setAutoLoading(true)
        await setValue(selection)
        setAutoLoading(false)
      }}
    />
  )
}

export const getTextFromEnumValue = (
  sentence: string,
  capitalized: boolean = false,
) => {
  return sentence
    .toLowerCase()
    .split('_')
    .map((word, index) => {
      if (capitalized || index === 0 || word === 'hedvig') {
        return word.charAt(0).toUpperCase() + word.slice(1)
      }
      return word
    })
    .join(' ')
}
