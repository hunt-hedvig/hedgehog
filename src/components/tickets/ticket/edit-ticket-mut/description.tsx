import React from 'react'
import { Mutation } from 'react-apollo'
import { connect } from 'react-redux'
import { Button, Form, Label, TextArea } from 'semantic-ui-react'
import { CHANGE_DESCRIPTION } from '../../../../features/taskmanager/queries'
import actions from '../../../../store/actions/index'

interface IChangeDescription {
  id: string
  showNotification: (data: any) => void
  description: string
  handleChange: (event: any) => void
}

class ChangeDescriptionMutation extends React.Component<
  IChangeDescription,
  {}
> {
  public render() {
    return (
      <Mutation
        mutation={CHANGE_DESCRIPTION}
        key={this.props.id + 'description'}
      >
        {(changeTicketDescription, { data }) => {
          return (
            <Form
              onSubmit={(e) => {
                e.preventDefault()
                changeTicketDescription({
                  variables: {
                    id: this.props.id,
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
              <Form.Field>
                <Label htmlFor="description">Edit description: </Label>
                <TextArea
                  row={3}
                  col={15}
                  name="description"
                  placeholder={this.props.description}
                  value={this.props.description}
                  onChange={this.props.handleChange}
                />
                <Button compact basic type="submit">
                  Change description
                </Button>
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
)(ChangeDescriptionMutation)
