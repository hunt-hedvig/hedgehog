import enGB from 'date-fns/locale/en-GB'
import React from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import styled from 'react-emotion'
import { Input } from 'semantic-ui-react'
registerLocale('enGB', enGB)

interface DatePickerProps {
  date: Date
  setDate: (date: Date) => void
  showTimePicker?: boolean
  fullWidth?: boolean
  placeholder?: string
}

const StyledInput = styled(Input)<{ fullWidth?: boolean }>(
  ({ fullWidth = false }) => {
    return {
      '&&': {
        width: fullWidth ? '100%' : '150px',
      },
      '&& input:hover': {
        cursor: 'pointer !important',
      },
    }
  },
)

export const DateTimePicker: React.FunctionComponent<DatePickerProps> = ({
  date,
  setDate,
  showTimePicker = false,
  fullWidth = false,
  placeholder,
}) => {
  return (
    <DatePicker
      locale={'enGB'}
      selected={date}
      placeholderText={placeholder}
      onChange={(newDate) => {
        setDate(newDate)
      }}
      showTimeSelect={showTimePicker}
      customInput={
        <StyledInput
          type="text"
          fullWidth={fullWidth}
          icon={showTimePicker ? 'clock outline' : 'calendar alternate outline'}
          iconPosition={'left'}
          maxLength={10}
        />
      }
      dateFormat={'yyyy-MM-dd'}
    />
  )
}
