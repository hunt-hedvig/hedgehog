import React from 'react'

import { Mutation } from 'react-apollo'
import { Button, Form, Label, TextArea } from 'semantic-ui-react'
import { CHANGE_REMINDER } from '../../../../features/taskmanager/queries'
import { IRemindNotification } from '../../types'
import Datepicker from '../create-ticket/datepicker'

interface IChangeReminder {
  id: string
  remindDate: any
  remindTime: any
  remindMessage: string
  showNotification: (message: string) => void
  handleChange: (event: any) => void
  currentReminder: IRemindNotification
}

export default class ChangeReminderMutation extends React.Component<
  IChangeReminder,
  {}
> {
  public render() {
    return (
      <Mutation mutation={CHANGE_REMINDER} key={this.props.id + 'reminder'}>
        {(changeTicketReminder, { data }) => {
          return (
            <Form
              onSubmit={(e) => {
                e.preventDefault()

                this.props.showNotification(
                  'Success! Set a reminder for: ' +
                    this.props.remindDate +
                    ' ' +
                    this.props.remindTime,
                )

                changeTicketReminder({
                  variables: {
                    ticketId: this.props.id,
                    newReminder: {
                      date: this.props.remindDate,
                      time: this.props.remindTime,
                      message: this.props.remindMessage,
                    },
                  },
                })
              }}
            >
              <Label htmlFor={'remindMessage'}>
                Message for remind notification:
              </Label>
              <br />
              <TextArea
                row={4}
                col={20}
                name="remindMessage"
                placeholder="Give a short remind message (max 100 characters)"
                value={this.props.remindMessage}
                onChange={(e) => this.props.handleChange(e)}
                maxLength={100}
              />
              <Datepicker
                handleChange={(e) => this.props.handleChange(e)}
                datepicker={{
                  name: 'remindDate',
                  value: this.props.remindDate,
                }}
                timepicker={{
                  name: 'remindTime',
                  value: this.props.remindTime,
                }}
              />
              <Button
                type="submit"
                compact
                disabled={this.props.remindMessage.length > 0 ? false : true}
              >
                Set reminder
              </Button>
              <p>Current reminder: {this.reminderToString()}</p>
            </Form>
          )
        }}
      </Mutation>
    )
  }
  private reminderToString = () => {
    if (
      this.props.currentReminder === undefined ||
      this.props.currentReminder === null ||
      this.props.currentReminder.date === null ||
      this.props.currentReminder.time === null
    ) {
      return 'none'
    }
    return (
      this.props.currentReminder.date + ' ' + this.props.currentReminder.time
    )
  }
}
