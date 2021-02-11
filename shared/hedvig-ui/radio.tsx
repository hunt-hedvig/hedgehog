import React, { useState } from 'react'
import styled from 'react-emotion'
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
  padding-right: 2rem;
`

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  setValue,
  options,
}) => {
  const [currentValue, setCurrentValue] = useState(value)
  return (
    <Form>
      {options.map((option) => {
        return (
          <RadioButtonField>
            <Radio
              key={option.value}
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
    </Form>
  )
}
