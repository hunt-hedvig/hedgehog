import { ActionMap, Container } from 'constate'
import toDate from 'date-fns/toDate'
import { DATE } from 'lib/messageTypes'
import * as moment from 'moment'
import 'moment/locale/sv'
import * as React from 'react'
import { isInclusivelyAfterDay, SingleDatePicker } from 'react-dates'
import { OPEN_UP } from 'react-dates/constants'
import 'react-dates/initialize'
import styled from 'react-emotion'
import { Mount } from 'react-lifecycle-components'
import { Form } from 'semantic-ui-react'
import { dateInputStyles } from './_dateinput'

const WidgetContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  '> *': {
    marginTop: '10px',
    '&:first-child': {
      marginTop: 0,
    },
  },
})

const DatePickerContainer = styled('div')({
  fontFamily: 'Circular Std Book !important',
  '.SingleDatePickerInput': {
    border: '1px solid #ccc',
    '.DateInput': {
      backgroundColor: 'transparent',
      input: {
        backgroundColor: 'transparent',
        boxSizing: 'border-box',
        border: '24px',
        textAlign: 'center',
        fontSize: '16px',
        lineHeight: '24px',
        padding: '7px 20px',
      },
    },
  },
})

interface DateInputProps {
  changeHandler: (type: string, e: any, value: object) => void
  changeType?: string
  label?: boolean | string
  date?: string
  disabled?: boolean
  forbidFuture?: boolean
  placeholder?: string
}
interface State {
  focused: boolean
  date?: any
}

interface Actions {
  dateChangeHandler: (newDate: any) => void
  focusHandler: (result: any) => void
}

const DateInput: React.SFC<DateInputProps> = (props) => {
  return (
    <Container<State, ActionMap<State, Actions>>
      initialState={{
        focused: false,
      }}
      actions={{
        dateChangeHandler: (newDate: any) => (state) => {
          if (moment(newDate).isValid()) {
            const parsed = newDate.toDate()
            const isoString = parsed.toISOString()
            props.changeHandler(props.changeType || DATE, null, {
              value: isoString,
            })
            return { date: moment(newDate) }
          } else {
            return { date: moment() }
          }
        },
        focusHandler: (result: any) => (state) => ({ focused: result.focused }),
      }}
    >
      {({ dateChangeHandler, focusHandler, focused, date }) => (
        <Mount
          on={() => {
            dateChangeHandler(moment(props.date))
          }}
        >
          <Form.Field disabled={props.disabled}>
            {props.label && (
              <label>
                {typeof props.label === 'string' ? props.label : 'Date'}
              </label>
            )}
            <WidgetContainer className={dateInputStyles}>
              <DatePickerContainer>
                <SingleDatePicker
                  date={date}
                  onDateChange={dateChangeHandler}
                  focused={focused}
                  onFocusChange={focusHandler}
                  numberOfMonths={1}
                  isOutsideRange={(day) =>
                    props.forbidFuture
                      ? !isInclusivelyAfterDay(moment(), day)
                      : false
                  }
                  openDirection={OPEN_UP}
                  hideKeyboardShortcutsPanel={true}
                />
              </DatePickerContainer>
            </WidgetContainer>
          </Form.Field>
        </Mount>
      )}
    </Container>
  )
}

export default DateInput
