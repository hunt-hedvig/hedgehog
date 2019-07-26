import React from 'react'
import { Input, Label, Grid, Divider } from 'semantic-ui-react'

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

export const DateTimePicker = (props: IDateTimePicker) => {
  return (
    <>
    <Grid columns={2} stackable >
      <Grid.Row verticalAlign='middle'>
      <Grid.Column>
      <Label htmlFor={props.datepicker.name}>
        Set remind notification date:
      </Label>
      <Input
        type="date"
        name={props.datepicker.name}
        value={props.datepicker.value}
        onChange={(e) => props.handleChange(e)}
      />
      </Grid.Column>

      <Grid.Column>
      <Label htmlFor={props.timepicker.name}>
        Set remind notification time:
      </Label>
      <Input
        type="text"
        maxLength={8}
        placeholder="hh:mm:zz"
        onChange={(e) => props.handleChange(e)}
        value={props.timepicker.value}
        name={props.timepicker.name}
        pattern="[0-9]{2}:[0-9]{2}:[0-9]{2}"
      />

      </Grid.Column>
      </Grid.Row>
     </Grid>
    </>

  )
}
