import React from 'react'
import { Mutation } from 'react-apollo'
import { Button, Form, Label, TextArea } from 'semantic-ui-react'
import { CHANGE_DESCRIPTION } from '../../../../features/taskmanager/queries'

interface IChangeDescription {
  id: string
  showNotification: (message: string) => void
  description: string
  handleChange: (event: any) => void
}

export default class ChangeDescriptionMutation extends React.Component<IChangeDescription, {}> {
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
                this.props.showNotification('Success! Changed description')
                changeTicketDescription({
                  variables: {
                    id: this.props.id,
                    newDescription: this.props.description,
                  },
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
