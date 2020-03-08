import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import moment from 'moment'
import * as React from 'react'

export default {
  title: 'DateTimePicker',
  component: DateTimePicker,
  decorators: [],
}

export const DateTimePickerOnlyDate: React.FunctionComponent = () => {
  const [date, setDate] = React.useState(moment())
  return <DateTimePicker date={date} setDate={setDate} />
}

export const DateTimePickerWithTime: React.FunctionComponent = () => {
  const [date, setDate] = React.useState(moment())
  return <DateTimePicker date={date} setDate={setDate} showTimePicker />
}
