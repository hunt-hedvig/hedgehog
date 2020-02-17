// @ts-nocheck
import React from 'react'
import { Mutation } from 'react-apollo'
import { connect } from 'react-redux'
import { Button, Form } from 'semantic-ui-react'
import { CHANGE_PRIORITY } from '../../../../features/taskmanager/queries'
import actions from '../../../../store/actions/index'
import { ColorIndicator } from '../color-indicator/colorIndicator'

interface IChangeDescription {
  id: string
  showNotification: (data: any) => void
  priority: number
  oldPriority: number
  handleChange: (event: any) => void
}

class ChangePriorityMutation extends React.Component<IChangeDescription, {}> {
  public render() {
    return (
      <Mutation mutation={CHANGE_PRIORITY}>
        {(changeTicketPriority) => {
          return (
            <Form
              onSubmit={(e) => {
                e.preventDefault()
                changeTicketPriority({
                  variables: {
                    ticketId: this.props.id,
                    newPriority: this.props.priority,
                  },
                })
                  .then(() => {
                    this.props.showNotification({
                      header: 'Change success!',
                      message: 'Changed the priority',
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
              <Form.Input
                label="Set Priority"
                min={0}
                max={1}
                name="priority"
                onChange={this.props.handleChange}
                step={0.01}
                type="range"
                value={this.props.priority}
              />
              <p>
                Current priority:
                <ColorIndicator percentage={this.props.priority} />
                {this.props.priority}
              </p>

              <Button
                compact
                toggle
                active={this.props.priority !== this.props.oldPriority}
                disabled={this.props.priority === this.props.oldPriority}
                type="submit"
              >
                Change priority
              </Button>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}

const mapActions = { ...actions.notificationsActions }

export default connect(null, mapActions)(ChangePriorityMutation)
