import React from 'react'
import { Mutation } from 'react-apollo'
import { connect } from 'react-redux'
import { Button, Dropdown, Form, Label } from 'semantic-ui-react'
import { CHANGE_STATUS } from '../../../../features/taskmanager/queries'
import {
  lookupStatus,
  TicketStatus,
} from '../../../../features/taskmanager/types'
import actions from '../../../../store/actions/index'

interface IChangeStatus {
  id: string
  status: TicketStatus
  currentStatus: TicketStatus
  showNotification: (data: any) => void
  handleChange: (event: any, value: any) => void
  options: any[]
}

class ChangeStatusMutation extends React.Component<IChangeStatus, {}> {
  public render() {
    return (
      <Mutation mutation={CHANGE_STATUS} key={this.props.id + 'status'}>
        {(changeTicketStatus, { data }) => {
          return (
            <Form
              onSubmit={(e) => {
                e.preventDefault()
                changeTicketStatus({
                  variables: {
                    ticketId: this.props.id,
                    newStatus: this.props.status,
                  },
                })
                  .then(() => {
                    this.props.showNotification({
                      header: 'Change success!',
                      message:
                        'Changed the status to: ' +
                        lookupStatus(this.props.status),
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
              <Form.Field inline>
                <Label htmlFor="status">Status: </Label>
                <Dropdown
                  name="status"
                  placeholder={lookupStatus(this.props.currentStatus)}
                  search
                  selection
                  options={this.props.options}
                  onChange={(event, { value }) =>
                    this.props.handleChange('status', value)
                  }
                />
                <Button  
                  type="submit" 
                  compact 
                  toggle
                  active={this.props.status !== this.props.currentStatus}
                  disabled={this.props.status === this.props.currentStatus}
                >
                  Change status
                </Button>
                <p>
                  Current status:{' '}
                  <em>{lookupStatus(this.props.currentStatus)}</em>{' '}
                </p>
              </Form.Field>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}

const mapActions = { ...actions.notificationsActions }

export default connect(
  null,
  mapActions,
)(ChangeStatusMutation)
