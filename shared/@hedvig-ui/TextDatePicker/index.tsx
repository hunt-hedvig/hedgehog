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
import { isKeyPressed, Keys } from '../hooks/keyboard/use-key-is-pressed'
import { useClickOutside } from '../hooks/use-click-outside'

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

export const getDate = (value: string) => {
  nlp.extend(numbers)
  nlp.extend(dates)

  return (
    nlp(value)
      // @ts-ignore
      .dates()
      .get(0)
  )
}

const InlineDatePicker = ({
  value,
  setValue,
  setTextValue,
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
            const newDate = parseISO(date.toISOString())
            const formattedDate = formatDate(newDate, 'yyyy-MM-dd')
            setValue(date)
            setTextValue(formattedDate)
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
  value?: Date | null
  onChange: (date: Date | null) => void
  errorMessage?: string
  maxDate?: Date
  showTimePicker?: boolean
}

export const TextDatePicker: React.FC<TextDatePickerProps> = ({
  value,
  onChange,
  error,
  errorMessage,
  maxDate,
  showTimePicker,
  ...props
}) => {
  const [showOldDatepicker, setShowOldDatepicker] = React.useState(false)
  const [textValue, setTextValue] = React.useState<string | null>()

  React.useEffect(() => {
    if (value) {
      const isoDate = parseISO(value.toISOString())
      const formattedDate = formatDate(isoDate, 'yyyy-MM-dd')
      setTextValue(formattedDate)
      return
    }

    setTextValue(null)
  }, [value])

  const setDateHandler = () => {
    const date = getDate(textValue || '')

    if (!date) {
      return
    }

    const newDate = date.start

    const isoDate = parseISO(newDate)
    const formattedDate = formatDate(isoDate, 'yyyy-MM-dd')

    if (value && formattedDate === formatDate(value, 'yyyy-MM-dd')) {
      return
    }

    onChange(new Date(newDate))
    setTextValue(formattedDate)
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
          if (isKeyPressed(e, Keys.Enter) && textValue) {
            setDateHandler()
          }
        }}
        {...props}
      />
      {error && <ErrorMessage>{errorMessage || 'Invalid Date'}</ErrorMessage>}
      {showOldDatepicker && (
        <InlineDatePicker
          value={value}
          setValue={onChange}
          setTextValue={setTextValue}
          setView={setShowOldDatepicker}
          maxDate={maxDate}
          showTimePicker={showTimePicker}
        />
      )}
    </Wrapper>
  )
}
