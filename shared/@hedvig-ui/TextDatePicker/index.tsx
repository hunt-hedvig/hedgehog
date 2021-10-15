import styled from '@emotion/styled'
import { FadeIn, Input } from '@hedvig-ui'
import nlp from 'compromise'
import dates from 'compromise-dates'
import numbers from 'compromise-numbers'
import { parseISO } from 'date-fns'
import formatDate from 'date-fns/format'
import React, { HTMLAttributes } from 'react'
import { Calendar } from 'react-bootstrap-icons'
import DatePicker from 'react-datepicker'
import { useClickOutside } from '../utils/click-outside'
import { Keys } from '../utils/key-press-hook'

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
`

export const getDate = (value: string) => {
  nlp.extend(numbers)
  nlp.extend(dates)

  const date = nlp(value)
    // @ts-ignore
    .dates()
    .get(0)

  return date
}

const InlineDatePicker = ({ value, setValue, setTextValue, setView }) => {
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
        />
      </FadeIn>
    </DatePickerWrapper>
  )
}

interface TextDatePickerProps
  extends Omit<HTMLAttributes<HTMLInputElement>, 'value'> {
  value?: Date | null
  setValue: (date: Date | null) => void
  error?: boolean
  errorMsg?: string
}

export const TextDatePicker: React.FC<TextDatePickerProps> = ({
  value,
  setValue,
  error,
  errorMsg,
  ...props
}) => {
  const [isOldDatepicker, setIsOldDatepicker] = React.useState(false)
  const [textValue, setTextValue] = React.useState<string | null>()

  React.useEffect(() => {
    if (value) {
      const isoDate = parseISO(value.toISOString())
      const formattedDate = formatDate(isoDate, 'yyyy-MM-dd')
      setTextValue(formattedDate)
    } else {
      setTextValue(null)
    }
  }, [value])

  const setDateHandler = () => {
    const date = getDate(textValue || '')

    if (date) {
      const newDate = date.start

      const isoDate = parseISO(newDate)
      const formattedDate = formatDate(isoDate, 'yyyy-MM-dd')

      setValue(new Date(newDate))
      setTextValue(formattedDate)
    }
  }

  return (
    <Wrapper>
      <Input
        error={error}
        icon={
          <CalendarIcon
            focus={isOldDatepicker}
            onClick={() => setIsOldDatepicker((prev) => !prev)}
            style={{ cursor: 'pointer' }}
          />
        }
        onBlur={() => {
          setDateHandler()
        }}
        value={textValue || ''}
        onChange={(e) => setTextValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.keyCode === Keys.Enter.code && textValue) {
            setDateHandler()
          }
        }}
        {...props}
      />
      {error && <ErrorMessage>{errorMsg || 'Invalid Date'}</ErrorMessage>}
      {isOldDatepicker && (
        <InlineDatePicker
          value={value}
          setValue={setValue}
          setTextValue={setTextValue}
          setView={setIsOldDatepicker}
        />
      )}
    </Wrapper>
  )
}
