import React from 'react'
import styled from 'react-emotion'
import { Dropdown, DropdownProps, Icon } from 'semantic-ui-react'

const Container = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

export interface DropdownOption {
  key: any
  value: any
  text: any
}

type DropdownEvent = (
  event: React.SyntheticEvent<HTMLElement>,
  data: DropdownProps,
) => void

export const ClearableDropdown: React.FC<{
  value: DropdownProps['value']
  onChange: DropdownEvent
  onClear?: DropdownEvent
  options: DropdownOption[]
  placeholder?: DropdownProps['placeholder']
  disabled?: boolean
}> = ({ value, onChange, onClear, options, placeholder = '', disabled }) => {
  return (
    <Container>
      <Dropdown
        placeholder={placeholder}
        disabled={disabled}
        fluid
        search
        selection
        selectOnBlur={false}
        value={value}
        options={options}
        onChange={onChange}
      />
      {!disabled && value !== '' && onClear !== undefined && (
        <Icon
          name="x"
          link
          onClick={onClear}
          style={{
            marginLeft: '-100px',
            marginRight: '40px',
            lineHeight: 2.67,
            zIndex: 99,
          }}
        />
      )}
    </Container>
  )
}
