import styled from '@emotion/styled'
import { Input } from '@hedvig-ui'
import enGB from 'date-fns/locale/en-GB'
import React from 'react'
import { Calendar } from 'react-bootstrap-icons'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

registerLocale('enGB', enGB)

interface DatePickerProps {
  date: Date | null
  setDate: (date: Date) => void
  showTimePicker?: boolean
  maxDate?: Date
  minDate?: Date
  fullWidth?: boolean
  placeholder?: string
  disabled?: boolean
  name?: string
  tabIndex?: number
}

const Wrapper = styled.div`
  .datePicker {
    width: 100%;
  }
`

const CalendarIcon = styled(Calendar)<{ focus?: boolean }>`
  transition: all 0.1s;
  color: ${({ theme, focus }) =>
    focus ? theme.accent : theme.placeholderColor};
  cursor: pointer;
  width: 1em;
`

export const DateTimePicker: React.FC<DatePickerProps> = ({
  date,
  setDate,
  maxDate,
  minDate,
  showTimePicker = false,
  fullWidth = false,
  placeholder,
  disabled = false,
  name,
  tabIndex = 0,
}) => {
  return (
    <Wrapper>
      <DatePicker
        tabIndex={tabIndex}
        wrapperClassName={fullWidth ? 'datePicker' : null}
        autoComplete="off"
        locale="enGB"
        selected={date}
        disabled={disabled}
        placeholderText={placeholder}
        onChange={(newDate) => {
          setDate(newDate)
        }}
        showTimeSelect={showTimePicker}
        maxDate={maxDate}
        minDate={minDate}
        name={name}
        customInput={<Input icon={<CalendarIcon />} />}
        dateFormat={showTimePicker ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'}
        timeIntervals={1}
      />
    </Wrapper>
  )
}
