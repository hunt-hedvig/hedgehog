import * as React from 'react'
import styled from 'react-emotion'
import { Dropdown, DropdownItemProps } from 'semantic-ui-react'
import { getTextFromEnumValue } from 'utils/enum'

const StyledDropdown = styled(Dropdown)({
  width: '100%',
  marginTop: '1rem',
})

export const EnumDropdown: React.FunctionComponent<{
  enumToSelectFrom: any
  placeholder: string
  setValue: (value: any) => void
}> = ({ enumToSelectFrom, placeholder, setValue }) => {
  const dropdownOptions: DropdownItemProps[] = Object.values(
    enumToSelectFrom,
  ).map((value, index) => {
    if (typeof value === 'number') {
      throw new Error(
        `EnumDropdown does not support enums with ordinal values (yet), enumToSelectFrom: ${JSON.stringify(
          enumToSelectFrom,
        )}`,
      )
    }
    return {
      key: index + 1,
      value: value as string,
      text: getTextFromEnumValue(value as string),
    }
  })

  return (
    <StyledDropdown
      placeholder={placeholder}
      options={dropdownOptions}
      selection
      onChange={(_, { value }) => setValue(value)}
    />
  )
}
