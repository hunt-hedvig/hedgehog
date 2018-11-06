import { ACTIVATION_DATE, CANCELLATION_DATE, DATE } from 'lib/messageTypes'
import * as moment from 'moment'
import 'moment/locale/sv'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { SingleDatePicker } from 'react-dates'
import { OPEN_UP } from 'react-dates/constants'
import 'react-dates/initialize'
import styled from 'react-emotion'
import { Form } from 'semantic-ui-react'
import { styles } from './_dateinput'

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

export default class DateInput extends React.Component {
  constructor() {
    super()
    this.state = {
      focused: false,
    }
  }

  public dateChangeHandler = (date) => {
    this.setState({
      date: moment(date),
    })

    this.props.changeHandler(this.props.changeType || DATE, null, {
      value: moment(date).toISOString(),
    })
  }

  public componentWillMount() {
    this.setState({ date: moment(this.props.date || moment()) }, () => {
      this.dateChangeHandler(this.state.date)
    })
  }

  public render() {
    return (
      <React.Fragment>
        <Form.Field disabled={this.props.disabled}>
          {this.props.label ? <label>Date</label> : null}
          <WidgetContainer className={styles}>
            <DatePickerContainer>
              <SingleDatePicker
                date={this.state.date}
                onDateChange={this.dateChangeHandler}
                focused={this.state.focused}
                onFocusChange={({ focused }) => this.setState({ focused })}
                numberOfMonths={1}
                isOutsideRange={() => false}
                openDirection={OPEN_UP}
                readOnly={true}
                hideKeyboardShortcutsPanel={true}
              />
            </DatePickerContainer>
          </WidgetContainer>
        </Form.Field>
      </React.Fragment>
    )
  }
}

DateInput.propTypes = {
  changeHandler: PropTypes.func.isRequired,
  changeType: PropTypes.string,
  cleanupForm: PropTypes.bool,
  date: PropTypes.string,
  label: PropTypes.bool,
  disabled: PropTypes.bool,
}
