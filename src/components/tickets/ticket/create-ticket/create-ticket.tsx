import format from 'date-fns/format'
import React from 'react'
import { Mutation } from 'react-apollo'
import styled from 'react-emotion'
import {
  Button,
  Checkbox,
  Dropdown,
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
  IEX_TEAM_MEMBERS,
} from '../../../../features/taskmanager/types'
import Datepicker from './datepicker'

const NewTicketBody = styled('div')`
  border: solid 1px gray;
  padding: 1em;
`
const teamOptions = createOptionsArray(IEX_TEAM_MEMBERS)

const priorityOptions = [
  { text: 'high', value: 1.0 },
  { text: 'medium', value: 0.5 },
  { text: 'low', value: 0.0 },
]

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
  priority: string
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
    priority: '',
    remindDate: '',
    remindTime: '',
    remindMessage: '',
    description: '',
    setReminder: false,
  }

  public componentDidMount() {
    const [date, time] = formatDateTime(new Date())
    this.setState({
      remindDate: date,
      remindTime: time,
    })
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
                  const reminder = this.state.setReminder
                    ? {
                        date: this.state.remindDate,
                        time: this.state.remindTime,
                        message: this.state.remindMessage,
                      }
                    : null

                  createNewTicket({
                    variables: {
                      ticket: {
                        assignedTo: this.state.assignedTo,
                        priority: this.state.priority,
                        type: 'REMIND',
                        //                        reminder,
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
                <br />
                <TextArea
                  row={4}
                  col={20}
                  name="description"
                  placeholder="Type in a description"
                  value={this.state.description}
                  onChange={(e) => this.handleChange(e)}
                />
                <br />
                <Label htmlFor="assignedTo">Assign to:</Label>
                <Dropdown
                  name="assignedTo"
                  placeholder="Select team member"
                  search
                  selection
                  options={teamOptions}
                  onChange={ (event, {value}) => this.handleOptionChange ("assignedTo",value )}
                />
                <Label htmlFor={'priority'}>Priority:</Label>
                <Dropdown
                  name="priority"
                  placeholder="Set priority"
                  selection
                  options={priorityOptions}
                  onChange={(event, {value}) => this.handleOptionChange("priority", value )}
                />
                <br />
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
                    <Datepicker
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
                <Button type="submit">Create</Button>
              </Form>
            )
          }}
        </Mutation>
      </NewTicketBody>
    )
  }

  private handleOptionChange = (id: string , value: string):void => {
    this.setState( {[id]: value  })
  }

  private handleChange = (event): void => {
    this.setState({ [event.target.name]: event.target.value })
  }
}

export default CreateNewTicket
