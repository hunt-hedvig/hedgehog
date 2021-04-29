import styled from '@emotion/styled'
import enGB from 'date-fns/locale/en-GB'
import { FieldProps } from 'formik'
import React from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Input } from 'semantic-ui-react'
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
}

const StyledInput = styled(Input)<{ fullWidth?: boolean }>`
  && {
    width: ${({ fullWidth }) => (fullWidth ? '100%' : '150px')};
  }
  && input:hover {
    cursor: pointer !important;
  }
  && input {
    caret-color: transparent;
  }
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
}) => {
  return (
    <DatePicker
      autoComplete="off"
      locale={'enGB'}
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
      customInput={
        <StyledInput
          type="text"
          fullWidth={fullWidth}
          icon={showTimePicker ? 'clock outline' : 'calendar alternate outline'}
          iconPosition={'left'}
          maxLength={10}
        />
      }
      dateFormat={showTimePicker ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'}
      timeIntervals={1}
    />
  )
}

export const FormikDateTimePicker: React.FC<FieldProps & DatePickerProps> = ({
  field: { value, name },
  form: { setFieldValue },
  ...props
}) => {
  return (
    <DateTimePicker
      {...props}
      date={value}
      setDate={(newValue: Date) => setFieldValue(name, newValue)}
      name={name}
    />
  )
}
