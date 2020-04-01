// @ts-nocheck
import { addDays, isFriday, set } from 'date-fns'
import format from 'date-fns/format'
import React from 'react'
import { Mutation, Query } from 'react-apollo'
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
  ME,
} from '../../../../features/taskmanager/queries'
import {
  createOptionsArray,
  IEX_TEAM_MEMBERS_OPTIONS,
} from '../../../../features/taskmanager/types'
import actions from '../../../../store/actions/index'
import { ColorIndicator } from '../color-indicator/colorIndicator'
import { DateTimePicker } from '../util/datetimepicker'

const NewTicketBody = styled('div')`
  border: solid 1px gray;
  border-radius: 2px;
  padding: 1em;
`
const teamOptions = createOptionsArray(IEX_TEAM_MEMBERS_OPTIONS)

const formatDateTime = (date) => {
  const fDate = format(addDays(date, isFriday(date) ? 3 : 1), 'yyyy-MM-dd')
  const fTime = format(
    set(new Date(), { hours: 9, minutes: 0, seconds: 0 }),
    'HH:mm:ss',
  )
  return [fDate, fTime]
}

interface ICreateNewTicket {
  closeModal: () => void
  showNotification: (data: any) => void
  referenceId: string | null
  memberId: string
  type: string
}

interface ICreateNewTicketState {
  assignedTo?: string
  priority: number
  setReminder: boolean
  remindDate: any
  remindTime: any
  remindMessage: any
  description: string
}

export class CreateNewTicket extends React.Component<
  ICreateNewTicket,
  ICreateNewTicketState
> {
  public state = {
    assignedTo: null,
    priority: 0,
    remindDate: null,
    remindTime: null,
    remindMessage: '',
    description: '',
    setReminder: false,
    type: this.props.type ?? 'REMIND',
    currentUser: {
      iEXOptionsIndex: 0,
      email: null,
    },
  }

  public componentDidMount(): void {
    const [date, time] = formatDateTime(new Date())
    this.setState({
      setReminder: true,
      remindDate: date,
      remindTime: time,
    })
  }

  public render() {
    return (
      <>
        <Query query={ME}>
          {({ data }) => {
            this.state.currentUser.email = data.me
            this.state.currentUser.iEXOptionsIndex = IEX_TEAM_MEMBERS_OPTIONS.findIndex(
              (user) => user.value === data.me,
            )
            return null
          }}
        </Query>
        <NewTicketBody>
          <h2>Create a new ticket</h2>
          <Mutation mutation={CREATE_TICKET}>
            {(createNewTicket) => {
              return (
                <Form
                  onSubmit={(e) => {
                    e.preventDefault()

                    createNewTicket({
                      variables: {
                        ticket: {
                          assignedTo: this.state.assignedTo,
                          priority: this.state.priority,
                          type: this.state.type,
                          remindNotificationDate: this.state.remindDate,
                          remindNotificationTime: this.state.remindTime,
                          remindMessage: this.state.description,
                          description: this.state.description,
                          referenceId: this.props.referenceId,
                          memberId: this.props.memberId,
                        },
                      },
                      refetchQueries: [{ query: GET_TICKETS }],
                    })
                      .then(() => {
                        this.props.closeModal()
                        this.props.showNotification({
                          header: 'Success!',
                          message: 'Created a new ticket.',
                          type: 'green',
                        })
                      })
                      .catch((error) => {
                        this.props.showNotification({
                          header: 'Error!',
                          message: error.message,
                          type: 'red',
                        })
                        throw error
                      })
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
                    placeholder={
                      teamOptions[this.state.currentUser.iEXOptionsIndex].text
                    }
                    search
                    selection
                    options={teamOptions}
                    onChange={(event, { value }) =>
                      this.handleOptionChange('assignedTo', value)
                    }
                  />
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
                        this.setState({
                          setReminder: flippedState,
                          remindMessage: this.state.description,
                        })
                      }}
                    />
                  </div>
                  {this.state.setReminder ? (
                    <div>
                      <Divider />
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
      </>
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
      ? this.state.remindDate !== '' && this.state.remindTime !== ''
      : true
    return (
      this.state.assignedTo !== '' &&
      this.state.priority !== null &&
      this.state.description.length > 0 &&
      validReminder
    )
  }
}

const mapActions = { ...actions.notificationsActions }
