import {
  Button as MuiButton,
  MenuItem,
  TextField as MuiTextField,
  withStyles,
} from '@material-ui/core'
import { DatePicker } from 'components/shared/inputs/DatePicker'
import { FieldSelect } from 'components/shared/inputs/FieldSelect'
import { Field, Form as FormikForm, Formik } from 'formik'
import * as React from 'react'
import styled from 'react-emotion'

interface State {
  confirmed: boolean
}

const SubmitButton = withStyles({
  root: {
    display: 'block',
    marginTop: '1rem',
    marginLeft: 'auto',
  },
})(MuiButton)

const TextField = withStyles({
  root: {
    display: 'block',
    width: '100%',
  },
})(MuiTextField)

const Form = styled(FormikForm)({ width: '100%' })

export class AddEntryForm extends React.Component<{}, State> {
  public state = {
    confirmed: false,
  }

  public render() {
    return (
      <Formik
        onSubmit={() => {
          if (!this.state.confirmed) {
            return
          }

          alert('wiie its done')
        }}
        initialValues={{ category: '' }}
      >
        <Form onChange={this.resetConfirmed}>
          <Field component={FieldSelect} name="category">
            <MenuItem value="CORRECTION">Correction</MenuItem>
            <MenuItem value="CAMPAIGN">Campaign</MenuItem>
          </Field>
          <Field
            component={TextField}
            label="Amount"
            type="number"
            name="amount"
          />
          <Field
            component={TextField}
            label="Reference"
            name="reference"
            placeholder="123123"
          />
          <Field
            component={TextField}
            label="Source"
            name="source"
            placeholder="Member"
          />
          <Field
            component={TextField}
            label="Title"
            name="title"
            placeholder="Återbetalning dubbeldragning"
          />
          <Field component={TextField} label="Comment" name="comment" />
          <Field
            component={DatePicker}
            label="From date"
            type="date"
            name="fromDate"
          />

          {!this.state.confirmed ? (
            <SubmitButton
              type="button"
              variant="contained"
              color="secondary"
              onClick={(e) => {
                e.preventDefault()
                this.toggleConfirmed()
              }}
            >
              Confirm entry
            </SubmitButton>
          ) : (
            <SubmitButton type="submit" variant="contained" color="primary">
              Create entry
            </SubmitButton>
          )}
        </Form>
      </Formik>
    )
  }
  private resetConfirmed = () => this.setState({ confirmed: false })

  private toggleConfirmed = () =>
    this.setState((state) => ({ confirmed: !state.confirmed }))
}
