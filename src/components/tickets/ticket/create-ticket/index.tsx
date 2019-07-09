import React from 'react'
import styled from 'react-emotion'
import { Button, Dropdown, TextArea, Checkbox, Form, Label } from 'semantic-ui-react'
import format from 'date-fns/format'
import { Mutation } from 'react-apollo'
import {
  CREATE_TICKET,
  GET_TICKETS,
} from '../../../../features/taskmanager/queries'
import {
  IEX_TEAM_MEMBERS,
  createOptionsArray,
  TICKET_PRIORITY_HIGH,
  TICKET_PRIORITY_MEDIUM,
  TICKET_PRIORITY_LOW,
} from '../../../../features/taskmanager/types'
import Datepicker from './datepicker.tsx'

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
  let fDate = format(date, 'yyyy-MM-dd')
  let fTime = format(date, 'HH:mm:ss')
  return [fDate, fTime]
}

class CreateNewTicket extends React.Component {
  state = {
    assignedTo: null,
    priority: null,
    remindNotificationDate: '',
    remindNotificationTime: '',
    remindMessage: '',
    description: '',
    setReminder: false, 
  }

  componentDidMount() {
    var [date, time] = formatDateTime(new Date())
    this.setState({
      remindNotificationDate: date,
      remindNotificationTime: time,
    })
  }

  render() {
    return (
      <NewTicketBody>
        <h2>Create a new ticket</h2>
        <Mutation mutation={CREATE_TICKET}>
          {(createNewTicket, { data }) => {
            return (
              <Form
                onSubmit={(e) => {
                  e.preventDefault()
                  const reminder = (this.state.setReminder) ? 
                    {
                      date: this.state.remindNotificationDate,
                      time: this.state.remindNotificationTime,
                      message: this.state.remindMessage, 
                    }
                    :
                    null 

                  createNewTicket({
                    variables: {
                      ticket:{
                        assignedTo: this.state.assignedTo,
                        priority: this.state.priority,
                        type: 'REMIND',
                        reminder, 
                        // reminder:{
                        //   date: this.state.remindNotificationDate,
                        //   time: this.state.remindNotificationTime,
                        //   message: this.state.remindMessage, 
                        // },
                        description: this.state.description,
                        status: 'WAITING',
                      }
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
                <Label htmlFor='assign'>Assign to:</Label>
                <Dropdown
                  name="assign"
                  placeholder="Select team member"
                  search
                  selection
                  options={teamOptions}
                  // value={this.state.inputAssignedTo}
                  onChange={(e, { value }) => {
                    this.setState({ assignedTo: value })
                  }}
                />
                <Label htmlFor={'priority'}>Priority:</Label>
                <Dropdown
                  name="priority"
                  placeholder="Set priority"
                  selection
                  options={priorityOptions}
                  // value={this.state.inputAssignedTo}
                  onChange={(e, { value }) => {
                    this.setState({ priority: value })
                  }}
                />
                <br/>
                <div>
                  <p><strong>Set reminder:</strong></p>
                  <Checkbox 
                    toggle 
                    label="Include a reminder"
                    checked={this.state.setReminder}
                    onChange={()=> { 
                        let flippedState = !this.state.setReminder
                        this.setState(  {setReminder: flippedState })}
                        }
                    />
                </div>
                { 
                  this.state.setReminder ? 
                  <div>
                  <Label htmlFor={'remindMessage'}>Message:</Label> 
                  <br/>
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
                    datepickerName="remindNotificationDate"
                    datepickerValue={this.state.remindNotificationDate}
                    timepickerName="remindNotificationTime"
                    timepickerValue={this.state.remindNotificationTime}
                  />
                  </div>
                  :
                  null 
                }
                <br/>
                <Button type="submit">Create</Button>
              </Form>
            )
          }}
        </Mutation>
      </NewTicketBody>
    )
  }

  private handleChange = (e) => {
    e.preventDefault()
    this.setState({ [event.target.name]: event.target.value })
  }
}

export default CreateNewTicket
