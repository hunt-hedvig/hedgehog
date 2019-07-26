import React from 'react'
import { Mutation } from 'react-apollo'
import { connect } from 'react-redux'
import { Button, Form, Label, TextArea } from 'semantic-ui-react'
import { CHANGE_REMINDER } from '../../../../features/taskmanager/queries'
import actions from '../../../../store/actions/index'
import { IRemindNotification } from '../../types'
import { DateTimePicker } from '../util/datetimepicker'

interface IChangeReminder {
  id: string
  remindDate: any
  remindTime: any
  remindMessage: string
  showNotification: (data: any) => void
  handleChange: (event: any) => void
  currentReminder: IRemindNotification
}

class ChangeReminderMutation extends React.Component<IChangeReminder, {}> {
  public render() {
    return (
      <Mutation mutation={CHANGE_REMINDER}>
        {(changeTicketReminder, { data }) => {
          return (
            <Form
              onSubmit={(e) => {
                e.preventDefault()
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
                  .then(() => {
                    this.props.showNotification({
                      header: 'Change success!',
                      message:
                        'Set a reminder for: ' +
                        this.props.remindDate +
                        ' ' +
                        this.props.remindTime,
                      type: 'green',
                    })
                  })
                  .catch((error) => {
                    this.props.showNotification({
                      header: 'Error',
                      message: error.message,
                      type: 'red',
                    })
                    throw error
                  })
              }}
            >
             
              <br />
              
              <DateTimePicker
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
              <Form.TextArea
                label="Message for the notification"
                row={4}
                col={20}
                name="remindMessage"
                placeholder="Give a short remind message (max 100 characters)"
                value={this.props.remindMessage}
                onChange={(e) => this.props.handleChange(e)}
                maxLength={100}
                error={(this.props.touchedDate || this.props.touchedTime || this.props.touchedMessage) && !(this.props.remindMessage.length > 0 )}
              />

              <Button
                type="submit"
                compact
                toggle
                disabled={this.props.remindMessage.length > 0 ? false : true}
                active ={!this.props.remindMessage.length > 0 ? false : true}

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
    if (!this.props.currentReminder || !this.props.currentReminder.date) {
      return 'none'
    }
    return (
      this.props.currentReminder.date + ' ' + this.props.currentReminder.time
    )
  }
}

const mapActions = { ...actions.notificationsActions }

export default connect(
  null,
  mapActions,
)(ChangeReminderMutation)
