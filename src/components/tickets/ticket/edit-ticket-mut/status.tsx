import React from 'react'
import { Mutation } from 'react-apollo'
import { Button, Dropdown, Form, Label } from 'semantic-ui-react'

import { CHANGE_STATUS } from '../../../../features/taskmanager/queries'
import { lookupStatus } from '../../../../features/taskmanager/types'

interface IChangeStatus {
  id: string
  status: string
  currentStatus: string
  showNotification: (message: string) => void
  handleChange: (event: any, value: any) => void
  options: any[]
}

export default class ChangeStatusMutation extends React.Component<
  IChangeStatus,
  {}
> {
  public render() {
    return (
      <Mutation mutation={CHANGE_STATUS} key={this.props.id + 'status'}>
        {(changeTicketStatus, { data }) => {
          return (
            <Form
              onSubmit={(e) => {
                e.preventDefault()
                this.props.showNotification(
                  'Success! Changed the status to: ' +
                    lookupStatus(this.props.status),
                )

                changeTicketStatus({
                  variables: {
                    ticketId: this.props.id,
                    newStatus: this.props.status,
                  },
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
                <Button basic type="submit" compact>
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
