import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import * as React from 'react'

export default {
  title: 'DateTimePicker',
  component: DateTimePicker,
  decorators: [],
}

export const DateTimePickerOnlyDate: React.FunctionComponent = () => {
  const [date, setDate] = React.useState(new Date())
  return <DateTimePicker date={date} setDate={setDate} />
}

export const DateTimePickerWithTime: React.FunctionComponent = () => {
  const [date, setDate] = React.useState(new Date())
  return <DateTimePicker date={date} setDate={setDate} showTimePicker />
}
