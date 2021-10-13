import { TextDatePicker } from '@hedvig-ui'
import React from 'react'

export default {
  title: 'TextDatePicker',
  component: TextDatePicker,
}

export const StandardTextDatePicker: React.FC = () => {
  const [value, setValue] = React.useState<string>('')
  const [date, setDate] = React.useState<string>('')

  return (
    <>
      <TextDatePicker
        value={value}
        setValue={setValue}
        setDate={setDate}
        placeholder="Enter date string"
      />
      <div style={{ marginTop: 20 }}>
        <span>Text:</span> {value}
        <br />
        <span>Date:</span> {date}
      </div>
    </>
  )
}
