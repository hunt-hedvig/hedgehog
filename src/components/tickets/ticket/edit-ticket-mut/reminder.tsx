// @ts-nocheck
import { CLAIM_PAGE_QUERY } from 'components/claims/claim-details/data'
import React from 'react'
import { Mutation } from 'react-apollo'
import { connect } from 'react-redux'
import { Button, Divider, Form } from 'semantic-ui-react'
import {
  CHANGE_REMINDER,
  GET_TICKETS,
} from '../../../../features/taskmanager/queries'
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
  touchedDate: boolean
  touchedTime: boolean
  touchedMessage: boolean
}

class ChangeReminderMutation extends React.Component<IChangeReminder, {}> {
  public render() {
    return (
      <Mutation
        mutation={CHANGE_REMINDER}
        refetchQueries={() => [
          {
            query: GET_TICKETS,
          },
        ]}
      >
        {(changeTicketReminder) => {
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
              <Divider horizontal> </Divider>
              <Button type="submit" compact toggle>
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

export default connect(null, mapActions)(ChangeReminderMutation)
