import React from 'react'
import { Mutation } from 'react-apollo'
import { connect } from 'react-redux'
import { Button, Dropdown, Form, Label } from 'semantic-ui-react'
import { ASSIGN_TO } from '../../../../features/taskmanager/queries'
import { lookupTeamMemberName } from '../../../../features/taskmanager/types'
import actions from '../../../../store/actions/index'

interface IAssignTicketTo {
  id: string
  showNotification: (data: any) => void
  handleChange: (id: string, value: any) => void
  options: any[]
  assignedTo: string
  currentlyAssignedTo: string
}

class AssignTicketToMutation extends React.Component<IAssignTicketTo, {}> {
  public render() {
    return (
      <Mutation mutation={ASSIGN_TO} key={this.props.id + 'assign'}>
        {(assignTicketToTeamMember, { data }) => {
          return (
            <Form
              onSubmit={(e) => {
                e.preventDefault()
                assignTicketToTeamMember({
                  variables: {
                    ticketId: this.props.id,
                    teamMemberId: this.props.assignedTo,
                  },
                })
                  .then(() => {
                    this.props.showNotification({
                      header: 'Change success!',
                      message:
                        'Assigned ticket to: ' +
                        lookupTeamMemberName(this.props.assignedTo),
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
                <Label htmlFor="assignedTo">Assign to: </Label>
                <Dropdown
                  name="assignedTo"
                  placeholder={lookupTeamMemberName(
                    this.props.currentlyAssignedTo,
                  )}
                  search
                  selection
                  options={this.props.options}
                  onChange={(event, { value }) =>
                    this.props.handleChange('assignedTo', value)
                  }
                />
                <Button
                  basic
                  type="submit"
                  compact
                  disabled={this.props.assignedTo === '' ? true : false}
                >
                  Assign
                </Button>
                <p>
                  Currently assigned to:{' '}
                  <em>
                    {lookupTeamMemberName(this.props.currentlyAssignedTo)}
                  </em>{' '}
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
)(AssignTicketToMutation)
