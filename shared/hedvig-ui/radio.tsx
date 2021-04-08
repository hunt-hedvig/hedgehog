import styled from '@emotion/styled'
import React, { useState } from 'react'
import { Form, Radio } from 'semantic-ui-react'

interface RadioGroupProps {
  value: any
  setValue: (value: any) => void
  options: Array<{
    value: any
    label: string
  }>
}

const RadioButtonField = styled(Form.Field)`
  display: inline-block;
  padding: 0.5rem 2rem 0 0;
`

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  setValue,
  options,
}) => {
  const [currentValue, setCurrentValue] = useState(value)
  return (
    <>
      {options.map((option) => {
        return (
          <RadioButtonField key={option.value}>
            <Radio
              label={option.label}
              value={option.value}
              checked={currentValue === option.value}
              onChange={(_, { value: v }) => {
                setCurrentValue(v)
                setValue(v)
              }}
            />
          </RadioButtonField>
        )
      })}
    </>
  )
}
