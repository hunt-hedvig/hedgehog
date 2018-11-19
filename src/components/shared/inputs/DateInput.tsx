import { ActionMap, Container } from 'constate'
import * as parse from 'date-fns/parse'
import { DATE } from 'lib/messageTypes'
import * as moment from 'moment'
import 'moment/locale/sv'
import * as React from 'react'
import { SingleDatePicker } from 'react-dates'
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
  changeType: string
  label: boolean
  date: string
  disabled: boolean
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
          const parsed = parse(newDate)
          const isoString = parsed.toISOString()
          props.changeHandler(props.changeType || DATE, null, {
            value: isoString,
          })
          return { date: moment(newDate) }
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
            {props.label ? <label>Date</label> : null}
            <WidgetContainer className={dateInputStyles}>
              <DatePickerContainer>
                <SingleDatePicker
                  date={date}
                  onDateChange={dateChangeHandler}
                  focused={focused}
                  onFocusChange={focusHandler}
                  numberOfMonths={1}
                  isOutsideRange={() => false}
                  openDirection={OPEN_UP}
                  readOnly={true}
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