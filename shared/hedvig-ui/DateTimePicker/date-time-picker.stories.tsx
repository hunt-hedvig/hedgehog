import { DateTimePicker } from '@hedvig-ui'
import React from 'react'

export default {
  title: 'DateTimePicker',
  component: DateTimePicker,
  decorators: [],
}

export const DateTimePickerOnlyDate: React.FC = () => {
  const [date, setDate] = React.useState(new Date())
  return <DateTimePicker date={date} setDate={setDate} />
}

export const DateTimePickerWithTime: React.FC = () => {
  const [date, setDate] = React.useState(new Date())
  return <DateTimePicker date={date} setDate={setDate} showTimePicker />
}
