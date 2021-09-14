import styled from '@emotion/styled'
import enGB from 'date-fns/locale/en-GB'
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
  tabIndex?: number
}

const StyledInput = styled(Input)<{ fullWidth?: boolean }>`
  && input {
    cursor: pointer;
    caret-color: transparent;
  }
`

const Wrapper = styled.div`
  .datePicker {
    width: 100%;
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
  tabIndex = 0,
}) => {
  return (
    <Wrapper>
      <DatePicker
        tabIndex={tabIndex}
        wrapperClassName={fullWidth ? 'datePicker' : null}
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
            fluid={fullWidth}
            icon={
              showTimePicker ? 'clock outline' : 'calendar alternate outline'
            }
            iconPosition={'left'}
            maxLength={10}
          />
        }
        dateFormat={showTimePicker ? 'yyyy-MM-dd HH:mm' : 'yyyy-MM-dd'}
        timeIntervals={1}
      />
    </Wrapper>
  )
}
