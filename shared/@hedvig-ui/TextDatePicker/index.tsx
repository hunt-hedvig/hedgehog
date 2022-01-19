import styled from '@emotion/styled'
import { FadeIn, Input, InputProps } from '@hedvig-ui'
import nlp from 'compromise'
import dates from 'compromise-dates'
import numbers from 'compromise-numbers'
import { parseISO } from 'date-fns'
import formatDate from 'date-fns/format'
import React from 'react'
import { Calendar } from 'react-bootstrap-icons'
import DatePicker from 'react-datepicker'
import { isPressing, Keys } from '../hooks/keyboard/use-key-is-pressed'
import { useClickOutside } from '../hooks/use-click-outside'
import { toast } from 'react-hot-toast'

const Wrapper = styled.div`
  width: 100%;
  position: relative;
`

const DatePickerWrapper = styled.div`
  position: absolute;
  top: 45px;
  z-index: 1000;
`

const ErrorMessage = styled.span`
  position: absolute;

  font-size: 14px;
  color: ${({ theme }) => theme.danger};

  bottom: -25px;
  right: 10px;
`

const CalendarIcon = styled(Calendar)<{ focus?: boolean }>`
  transition: all 0.1s;
  color: ${({ theme, focus }) =>
    focus ? theme.accent : theme.placeholderColor};
  cursor: pointer;
  width: 1em;
`

interface Dates {
  dates: () => { get: (n: number) => { start: string } }
}

export const getDate = (value: string) => {
  nlp.extend(numbers)
  nlp.extend(dates)

  const result = nlp(value) as unknown as Dates

  return result.dates().get(0)
}

const InlineDatePicker = ({
  value,
  setValue,
  setView,
  maxDate,
  showTimePicker,
}) => {
  const pickerRef = React.useRef<HTMLDivElement>(null)

  useClickOutside(pickerRef, () => setView(false))

  return (
    <DatePickerWrapper ref={pickerRef}>
      <FadeIn duration={250}>
        <DatePicker
          inline
          date={value || null}
          onChange={(date) => {
            setValue(date)
            setView(false)
          }}
          showTimeSelect={showTimePicker}
          maxDate={maxDate}
          fullWidth={true}
        />
      </FadeIn>
    </DatePickerWrapper>
  )
}

interface TextDatePickerProps extends Omit<InputProps, 'value' | 'onChange'> {
  value?: string | null
  onChange: (date: string | null) => void
  errorMessage?: string
  maxDate?: Date
  showTimePicker?: boolean
  withCurrentTime?: boolean
}

export const TextDatePicker: React.FC<TextDatePickerProps> = ({
  value,
  onChange,
  error,
  errorMessage,
  maxDate,
  showTimePicker,
  withCurrentTime,
  ...props
}) => {
  const [showOldDatepicker, setShowOldDatepicker] = React.useState(false)
  const [textValue, setTextValue] = React.useState<string | null>()

  React.useEffect(() => {
    setTextValue(value?.split('T')[0])
  }, [value])

  const formatAndSetDate = (date: Date) => {
    const isoDate = parseISO(date.toISOString())
    let formattedDate: string = formatDate(isoDate, 'yyyy-MM-dd')

    if (withCurrentTime) {
      const isoTime = new Date().toISOString().split('T')[1]
      formattedDate = formattedDate + 'T' + isoTime
    }

    setTextValue(value?.split('T')[0])
    onChange(formattedDate)
  }

  const setDateHandler = () => {
    const date = getDate(textValue || '')

    if (!date) {
      return
    }

    const newDate = new Date(date.start)

    if (maxDate && maxDate < newDate) {
      const formattedDate = formatDate(maxDate, 'yyyy-MM-dd')
      toast.error('Date cannot be after ' + formattedDate)
      setTextValue(value)
      return
    }

    formatAndSetDate(newDate)
  }

  return (
    <Wrapper>
      <Input
        error={error}
        icon={
          <CalendarIcon onClick={() => setShowOldDatepicker((prev) => !prev)} />
        }
        onBlur={() => {
          setDateHandler()
        }}
        value={textValue || ''}
        onChange={(e) => setTextValue(e.target.value)}
        onKeyDown={(e) => {
          if (isPressing(e, Keys.Enter)) {
            setDateHandler()
          }
        }}
        {...props}
      />
      {error && <ErrorMessage>{errorMessage || 'Invalid Date'}</ErrorMessage>}
      {showOldDatepicker && (
        <InlineDatePicker
          value={value}
          setValue={(dateValue) => formatAndSetDate(dateValue)}
          setView={setShowOldDatepicker}
          maxDate={maxDate}
          showTimePicker={showTimePicker}
        />
      )}
    </Wrapper>
  )
}
