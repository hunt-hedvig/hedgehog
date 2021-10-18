import { Spacing, TextDatePicker } from '@hedvig-ui'
import React from 'react'

export default {
  title: 'TextDatePicker',
  component: TextDatePicker,
}

export const StandardTextDatePicker: React.FC = () => {
  const [error, setError] = React.useState(false)
  const [value, setValue] = React.useState<Date | null>()

  const setDateHandler = (date: Date | null) => {
    if (date) {
      setError(false)
      setValue(date)
    } else {
      setError(true)
      setValue(null)
    }
  }

  return (
    <Spacing top>
      <TextDatePicker
        error={error}
        errorMessage="Invalid Date"
        value={value}
        onChange={setDateHandler}
        placeholder="Enter date string"
      />
      <Spacing top>
        <span>Date:</span> {value?.toDateString()}
      </Spacing>
    </Spacing>
  )
}
