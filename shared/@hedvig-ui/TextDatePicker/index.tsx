import styled from '@emotion/styled'
import { Input, Shadowed } from '@hedvig-ui'
import nlp from 'compromise'
import dates from 'compromise-dates'
import numbers from 'compromise-numbers'
import formatDate from 'date-fns/format'
import React, { HTMLAttributes } from 'react'
import { Keys } from '../utils/key-press-hook'
import { usePlatform } from '../utils/platform'

export const getDate = (value: string) => {
  nlp.extend(numbers)
  nlp.extend(dates)

  const date = nlp(value)
    // @ts-ignore
    .dates()
    .get(0)

  return date
}

const ChatTip = styled.div`
  margin-top: 10px;
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

interface TextDatePickerProps
  extends Omit<HTMLAttributes<HTMLInputElement>, 'value'> {
  value: string
  setValue: any
  setDate: any
}

export const TextDatePicker: React.FC<TextDatePickerProps> = ({
  value,
  setValue,
  setDate,
  ...props
}) => {
  const [textFieldFocused, setTextFieldFocused] = React.useState(false)
  const { isMetaKey, metaKey } = usePlatform()

  const setDateHandler = () => {
    const date = getDate(value)

    if (date) {
      const newDate = new Date(date.start)
      const formattedDate = formatDate(newDate, 'yyyy-MM-dd')

      setDate(formattedDate)
    }
  }

  return (
    <div>
      <Input
        onFocus={() => setTextFieldFocused(true)}
        onBlur={() => setTextFieldFocused(false)}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (isMetaKey(e) && e.keyCode === Keys.Enter.code && value) {
            setDateHandler()
          }
        }}
        {...props}
      />
      {textFieldFocused && (
        <ChatTip>
          Press <Shadowed>{metaKey.hint}</Shadowed> + <Shadowed>Enter</Shadowed>{' '}
          to get date
        </ChatTip>
      )}
    </div>
  )
}
