import React from 'react'
import { Input, Label } from 'semantic-ui-react'
import Datepicker from '../../../shared/inputs/DatePicker'

interface IDateTimePicker {
  datepicker: {
    name: string
    value: any
  }
  timepicker: {
    name: string
    value: any
  }
  handleChange: (event: any) => void
}

class DateTimePicker extends React.Component<IDateTimePicker, {}> {
  public render() {
    return (
      <React.Fragment>
        <Label htmlFor={this.props.datepicker.name}>
          Set remind notification date:
        </Label>
        <br />
        <input
          type="date"
          name={this.props.datepicker.name}
          value={this.props.datepicker.value}
          onChange={(e) => this.props.handleChange(e)}
        />
        <br />
        <Label htmlFor={this.props.timepicker.name}>
          Set remind notification time:
        </Label>
        <br />
        <Input
          type="text"
          maxLength={8}
          placeholder="hh:mm:zz"
          onChange={(e) => this.props.handleChange(e)}
          value={this.props.timepicker.value}
          name={this.props.timepicker.name}
          pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
        />
      </React.Fragment>
    )
  }
}

export default DateTimePicker
