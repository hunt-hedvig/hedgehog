import format from 'date-fns/format'
import React from 'react'
import { Mutation } from 'react-apollo'
import styled from 'react-emotion'
import {
  Button,
  Checkbox,
  Divider,
  Form,
  Label,
  TextArea,
} from 'semantic-ui-react'
import {
  CREATE_TICKET,
  GET_TICKETS,
} from '../../../../features/taskmanager/queries'
import {
  createOptionsArray,
  IEX_TEAM_MEMBERS_OPTIONS,
} from '../../../../features/taskmanager/types'
import ColorIndicator from '../color-indicator/colorIndicator'
import DateTimePicker from '../util/datetimepicker'

const NewTicketBody = styled('div')`
  border: solid 1px gray;
  border-radius: 2px;
  padding: 1em;
`
const teamOptions = createOptionsArray(IEX_TEAM_MEMBERS_OPTIONS)

const formatDateTime = (date) => {
  const fDate = format(date, 'yyyy-MM-dd')
  const fTime = format(date, 'HH:mm:ss')
  return [fDate, fTime]
}

interface ICreateNewTicket {
  closeModal: () => void
}

interface ICreateNewTicketState {
  assignedTo: string
  priority: number
  setReminder: boolean
  remindDate: any
  remindTime: any
  remindMessage: any
  description: string
}

class CreateNewTicket extends React.Component<
  ICreateNewTicket,
  ICreateNewTicketState
> {
  public state = {
    assignedTo: '',
    priority: 0,
    remindDate: null,
    remindTime: null,
    remindMessage: '',
    description: '',
    setReminder: false,
  }

  public render() {
    return (
      <NewTicketBody>
        <h2>Create a new ticket</h2>
        <Mutation mutation={CREATE_TICKET}>
          {(createNewTicket, { data }) => {
            return (
              <Form
                onSubmit={(e) => {
                  e.preventDefault()

                  createNewTicket({
                    variables: {
                      ticket: {
                        assignedTo: this.state.assignedTo,
                        priority: this.state.priority,
                        type: 'REMIND',
                        remindNotificationDate: this.state.remindDate,
                        remindNotificationTime: this.state.remindTime,
                        remindMessage: this.state.remindMessage,
                        description: this.state.description,
                        status: 'WAITING',
                      },
                    },
                    refetchQueries: [{ query: GET_TICKETS }],
                  })
                  this.props.closeModal()
                }}
              >
                <Label htmlFor={'description'}>Description:</Label>
                <Form.TextArea
                  row={4}
                  col={20}
                  name="description"
                  placeholder="Type in a description"
                  value={this.state.description}
                  onChange={(e) => this.handleChange(e)}
                />
                <Divider />
                <Label htmlFor="assignedTo">Assign to:</Label>
                <Form.Dropdown
                  name="assignedTo"
                  placeholder="Select team member"
                  search
                  selection
                  options={teamOptions}
                  onChange={(event, { value }) =>
                    this.handleOptionChange('assignedTo', value)
                  }
                />
                <Divider />

                <Form.Input
                  label="Set Priority"
                  min={0}
                  max={1}
                  name="priority"
                  onChange={(event) => this.handleChange(event)}
                  step={0.05}
                  type="range"
                  value={this.state.priority}
                />
                <p>
                  Current priority:
                  <ColorIndicator percentage={this.state.priority} />
                  {this.state.priority}
                </p>
                <Divider />

                <div>
                  <p>
                    <strong>Set reminder:</strong>
                  </p>
                  <Checkbox
                    toggle
                    label="Include a reminder"
                    checked={this.state.setReminder}
                    onChange={() => {
                      const flippedState = !this.state.setReminder
                      this.setState({ setReminder: flippedState })
                    }}
                  />
                </div>
                {this.state.setReminder ? (
                  <div>
                    <Divider />
                    <Label htmlFor={'remindMessage'}>Message:</Label>
                    <br />
                    <TextArea
                      row={4}
                      col={20}
                      name="remindMessage"
                      placeholder="Give a short remind message (max 100 characters)"
                      value={this.state.remindMessage}
                      onChange={(e) => this.handleChange(e)}
                      maxLength={100}
                    />
                    <br />
                    <DateTimePicker
                      handleChange={this.handleChange}
                      datepicker={{
                        name: 'remindDate',
                        value: this.state.remindDate,
                      }}
                      timepicker={{
                        name: 'remindTime',
                        value: this.state.remindTime,
                      }}
                    />
                  </div>
                ) : null}
                <br />
                <Divider />
                <Button type="submit" disabled={!this.validityCheck()}>
                  Create
                </Button>
              </Form>
            )
          }}
        </Mutation>
      </NewTicketBody>
    )
  }

  private handleOptionChange = (id: string, value: string): void => {
    this.setState({ [id]: value })
  }

  private handleChange = (event): void => {
    this.setState({ [event.target.name]: event.target.value })
  }

  private validityCheck = (): boolean => {
    const validReminder = this.state.setReminder
      ? this.state.remindDate !== '' &&
        this.state.remindTime !== '' &&
        this.state.remindMessage.length > 0
      : true
    return (
      this.state.assignedTo !== '' &&
      this.state.priority !== null &&
      this.state.description.length > 0 &&
      validReminder
    )
  }
}

export default CreateNewTicket
