import styled from '@emotion/styled'
import { Input } from '@hedvig-ui'
import nlp from 'compromise'
import dates from 'compromise-dates'
import numbers from 'compromise-numbers'
import { parseISO } from 'date-fns'
import formatDate from 'date-fns/format'
import React, { HTMLAttributes } from 'react'
import { CalendarDate } from 'react-bootstrap-icons'
import DatePicker from 'react-datepicker'
import { Keys } from '../utils/key-press-hook'

const Wrapper = styled.div`
  width: fit-content;
  position: relative;

  & .react-datepicker {
    position: absolute;
    top: 60px;
  }
`

const ErrorMessage = styled.span`
  position: absolute;

  font-size: 14px;
  color: ${({ theme }) => theme.danger};

  bottom: -25px;
  right: 10px;
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

interface TextDatePickerProps
  extends Omit<HTMLAttributes<HTMLInputElement>, 'value'> {
  value?: Date | null
  setValue: (date: Date | null) => void
}

export const TextDatePicker: React.FC<TextDatePickerProps> = ({
  value,
  setValue,
  ...props
}) => {
  const [isOldDatepicker, setIsOldDatepicker] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [textValue, setTextValue] = React.useState(
    value?.toISOString()?.split('T')[0] ?? null,
  )

  const setDateHandler = () => {
    const date = getDate(textValue || '')

    if (date) {
      setError(false)
      const newDate = date.start

      const isoDate = parseISO(newDate)
      const formattedDate = formatDate(isoDate, 'yyyy-MM-dd')

      setValue(new Date(newDate))
      setTextValue(formattedDate)
    } else {
      setValue(null)
      setError(true)
    }
  }

  return (
    <Wrapper>
      <Input
        error={error}
        icon={
          <CalendarDate
            onClick={() => setIsOldDatepicker((prev) => !prev)}
            style={{ cursor: 'pointer' }}
          />
        }
        size="large"
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
      {error && <ErrorMessage>Invalid date</ErrorMessage>}
      {isOldDatepicker && (
        <DatePicker
          inline
          date={value || null}
          onChange={(date) => {
            setError(false)
            const newDate = parseISO(date.toISOString())
            const formattedDate = formatDate(newDate, 'yyyy-MM-dd')
            setValue(date)
            setTextValue(formattedDate)
            setIsOldDatepicker(false)
          }}
        />
      )}
    </Wrapper>
  )
}
