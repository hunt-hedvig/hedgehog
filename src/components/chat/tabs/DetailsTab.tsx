import { WideModal } from 'components/shared/modals/WideModal'
import TableFields from 'components/shared/table-fields/TableFields'
import { FraudulentStatusEdit } from 'lib/fraudulentStatus'
import { dateTimeFormatter, getFieldName, getFieldValue } from 'lib/helpers'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Button, Form, Header, Icon, Modal, Table } from 'semantic-ui-react'
import InsuranceTrace from './insurance-trace/InsuranceTrace'

const memberFieldFormatters = {
  signedOn: (date: string) => dateTimeFormatter(date, 'yyyy-MM-dd HH:mm:ss'),
  createdOn: (date: string) => dateTimeFormatter(date, 'yyyy-MM-dd HH:mm:ss'),
}

export default class DetailsTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      modalOpen: false,
      member: [],
      editFraud: false,
      fraudStatus: '',
      fraudDescription: '',
    }
  }

  public handleOpen = () => this.setState({ modalOpen: true })

  public handleClose = () => this.setState({ modalOpen: false })

  public isDisabled = (field) => {
    switch (field.toLowerCase()) {
      case 'memberid':
      case 'status':
      case 'ssn':
      case 'birthdate':
      case 'signedOn':
        return true
      default:
        return false
    }
  }

  public handleChange = (field) => (e) => {
    const { member } = this.state
    member[field] = e.target.value
    this.setState({ member })
  }

  public handleCancel = () => {
    this.setState({ member: [] })
    this.handleClose()
  }

  public removeSsnIfNotSignedMember = (memberInfo) => {
    if (memberInfo.status !== 'SIGNED') {
      memberInfo.ssn = ''
    }
  }

  public handleSubmissionButton = () => {
    const { editMemberDetails, messages } = this.props
    const submittedMember = { ...messages.member, ...this.state.member }
    editMemberDetails(submittedMember)
    this.handleClose()
  }

  public render() {
    let traceData
    const {
      messages: { member },
      saveFraudulentStatus,
    } = this.props

    const {
      traceMemberInfo,
      fraudulentDescription,
      fraudulentStatus,
      ...memberInfo
    } = member || {}

    traceData = traceMemberInfo

    {
      this.removeSsnIfNotSignedMember(memberInfo)
    }

    return member ? (
      <>
        <Table selectable>
          <Table.Body>
            <TableFields
              fields={memberInfo}
              fieldFormatters={memberFieldFormatters}
            />
            <FraudulentStatusEdit
              getFraudStatusInfo={() => ({
                status: this.state.fraudStatus || fraudulentStatus,
                description:
                  this.state.fraudDescription || fraudulentDescription,
              })}
              setState={(val, fs, desc) => {
                this.setState({
                  editFraud: val,
                  fraudStatus: fs,
                  fraudDescription: desc,
                })
              }}
              getState={() => this.state.editFraud}
              action={(fraudStatus, fraudDescription) => {
                saveFraudulentStatus(
                  fraudStatus,
                  fraudDescription,
                  memberInfo.memberId,
                )
              }}
            />
          </Table.Body>
          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell />
              <Table.HeaderCell colSpan="2">
                <WideModal
                  className="scrolling"
                  trigger={
                    <Button
                      floated="right"
                      icon
                      labelposition="left"
                      primary
                      size="medium"
                      onClick={this.handleOpen}
                    >
                      <Icon name="edit" /> Edit Member
                    </Button>
                  }
                  open={this.state.modalOpen}
                  onClose={this.handleClose}
                  basic
                  size="small"
                  dimmer="blurring"
                >
                  <Header icon="edit" content="Edit Member" />
                  <Modal.Content>
                    <Form inverted size="small">
                      <>
                        {Object.keys(memberInfo).map((field) => (
                          <Form.Input
                            key={field}
                            label={getFieldName(field)}
                            disabled={this.isDisabled(field)}
                            defaultValue={getFieldValue(member[field])}
                            onChange={this.handleChange(field)}
                          />
                        ))}
                      </>
                      <Button.Group floated="right" labelposition="left">
                        <Button type="button" onClick={this.handleCancel}>
                          Cancel
                        </Button>
                        <Button.Or />
                        <Button
                          type="button"
                          onClick={this.handleSubmissionButton}
                          positive
                        >
                          Submit
                        </Button>
                      </Button.Group>
                    </Form>
                  </Modal.Content>
                </WideModal>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
        <InsuranceTrace traceData={traceData} />
      </>
    ) : (
      <Header>No member info</Header>
    )
  }
}

DetailsTab.propTypes = {
  messages: PropTypes.object.isRequired,
  editMemberDetails: PropTypes.func.isRequired,
  saveFraudulentStatus: PropTypes.func.isRequired,
}
