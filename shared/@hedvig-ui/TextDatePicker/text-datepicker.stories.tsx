import { TextDatePicker } from '@hedvig-ui'
import React from 'react'

export default {
  title: 'TextDatePicker',
  component: TextDatePicker,
}

export const StandardTextDatePicker: React.FC = () => {
  const [value, setValue] = React.useState<Date | null>()

  return (
    <div style={{ padding: 30 }}>
      <TextDatePicker
        value={value}
        setValue={(date: Date | null) => setValue(date)}
        placeholder="Enter date string"
        style={{ width: 300 }}
      />
      <div style={{ marginTop: 20 }}>
        <span>Date:</span> {value?.toDateString()}
      </div>
    </div>
  )
}
