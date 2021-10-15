import { TextDatePicker } from '@hedvig-ui'
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
    <div style={{ padding: 30 }}>
      <TextDatePicker
        error={error}
        errorMessage="Invalid Date"
        value={value}
        onChange={setDateHandler}
        placeholder="Enter date string"
      />
      <div style={{ marginTop: 20 }}>
        <span>Date:</span> {value?.toDateString()}
      </div>
    </div>
  )
}
