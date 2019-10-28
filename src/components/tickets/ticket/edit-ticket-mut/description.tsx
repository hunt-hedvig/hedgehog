import React from 'react'
import { Mutation } from 'react-apollo'
import { connect } from 'react-redux'
import { Button, Form } from 'semantic-ui-react'
import { CHANGE_DESCRIPTION } from '../../../../features/taskmanager/queries'
import actions from '../../../../store/actions/index'

interface IChangeDescription {
  id: string
  showNotification: (data: any) => void
  description: string
  oldDescription: string
  handleChange: (event: any) => void
  touched: boolean
}

class ChangeDescriptionMutation extends React.Component<
  IChangeDescription,
  {}
> {
  public render() {
    return (
      <Mutation mutation={CHANGE_DESCRIPTION}>
        {(changeTicketDescription, { data }) => {
          return (
            <Form
              onSubmit={(e) => {
                e.preventDefault()
                changeTicketDescription({
                  variables: {
                    ticketId: this.props.id,
                    newDescription: this.props.description,
                  },
                })
                  .then(() => {
                    this.props.showNotification({
                      header: 'Change success!',
                      message: 'Changed the description',
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
              <Form.TextArea
                label="Edit description"
                row={3}
                col={15}
                name="description"
                placeholder={this.props.oldDescription}
                value={this.props.description}
                onChange={this.props.handleChange}
              />
              <Button
                compact
                toggle
                active={this.props.touched}
                disabled={!this.props.touched}
                type="submit"
              >
                Change description
              </Button>
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
)(ChangeDescriptionMutation)
