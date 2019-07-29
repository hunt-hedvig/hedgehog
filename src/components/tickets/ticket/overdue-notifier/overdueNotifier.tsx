import React from 'react'
import { Mutation } from 'react-apollo'
import { Button, Form, Icon, Popup } from 'semantic-ui-react'
import { CHANGE_REMINDER } from '../../../../features/taskmanager/queries'

export const OverdueNotifier = (props) => {
  return (
    <Popup
      hoverable
      trigger={<Icon name="exclamation triangle" size="large" color="red" />}
    >
      <Mutation mutation={CHANGE_REMINDER} key={props.id + 'reminder'}>
        {(changeTicketReminder, { data }) => {
          return (
            <Form
              onSubmit={(event) => {
                event.preventDefault()
                changeTicketReminder({
                  variables: {
                    ticketId: props.id,
                    newReminder: {
                      date: null,
                      time: null,
                      message: '',
                    },
                  },
                })
              }}
            >
              This ticket's reminder is overdue
              <Button type="submit" size="small">
                Acknowledge
              </Button>
            </Form>
          )
        }}
      </Mutation>
    </Popup>
  )
}
