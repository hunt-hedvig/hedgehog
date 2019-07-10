import React from 'react'
import { Mutation } from 'react-apollo'
import { Button, Dropdown, Form, Label } from 'semantic-ui-react'
import { ASSIGN_TO } from '../../../../features/taskmanager/queries'
import { lookupTeamMemberName } from '../../../../features/taskmanager/types'

interface IAssignTicketTo {
  id: string
  showNotification: (message: string) => void
  handleChange: (id: string, value: any) => void
  options: any[]
  assignedTo: string
}

export default class AssignTicketToMutation extends React.Component<
  IAssignTicketTo,
  {}
> {
  public render() {
    return (
      <Mutation mutation={ASSIGN_TO} key={this.props.id + 'assign'}>
        {(assignTicketToTeamMember, { data }) => {
          return (
            <Form
              onSubmit={(e) => {
                e.preventDefault()

                this.props.showNotification(
                  'Success! Assigned the ticket to: ' +
                    lookupTeamMemberName(this.props.assignedTo),
                )
                assignTicketToTeamMember({
                  variables: {
                    ticketId: this.props.id,
                    teamMemberId: this.props.assignedTo,
                  },
                })
              }}
            >
              <Form.Field inline>
                <Label htmlFor="assignedTo">Assign to: </Label>
                <Dropdown
                  name="assignedTo"
                  placeholder="Select team member"
                  search
                  selection
                  options={this.props.options}
                  onChange={(event, { value }) =>
                    this.props.handleChange('assignedTo', value)
                  }
                />
                <Button basic type="submit" compact>
                  Assign
                </Button>
              </Form.Field>
            </Form>
          )
        }}
      </Mutation>
    )
  }
}
