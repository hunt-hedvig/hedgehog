import { ActionMap, Container } from 'constate'
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

const WidgetContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  > * {
    margin-top: 10px;
    &:first-child {
      margin-top: 0;
    }
  }
`

const DatePickerContainer = styled('div')`
  font-family: 'Circular Std Book' !important;
  .SingleDatePickerInput {
    border: 1px solid #ccc;
    .DateInput {
      background-color: transparent;
      input {
        background-color: transparent;
        box-sizing: border-box !important;
        border: 24px;
        text-align: center;
        font-size: 16px;
        line-height: 24px;
        padding: 7px 20px;
      }
    }
  }
`

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
  const initialState: State = {
    focused: false,
  }

  const actions: ActionMap<State, Actions> = {
    dateChangeHandler: (newDate: any) => (state) => {
      props.changeHandler(props.changeType || DATE, null, {
        value: moment(newDate).toISOString(),
      })
      return { date: moment(newDate) }
    },
    focusHandler: (result: any) => (state) => ({ focused: result.focused }),
  }

  return (
    <Container<State, Actions> initialState={initialState} actions={actions}>
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
