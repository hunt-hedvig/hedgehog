import { Member } from 'api/generated/graphql'
import { WideModal } from 'components/shared/modals/WideModal'
import TableFields from 'components/shared/table-fields/TableFields'
import {
  getEditMemberInfoOptions,
  useEditMemberInfo,
} from 'graphql/use-edit-member-info'
import {
  getSetFraudulentStatusOptions,
  useSetFraudulentStatus,
} from 'graphql/use-set-fraudulent-status'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Button, Form, Header, Icon, Modal, Table } from 'semantic-ui-react'
import { FraudulentStatusEdit } from 'utils/fraudulentStatus'
import { dateTimeFormatter, getFieldName, getFieldValue } from 'utils/helpers'

const memberFieldFormatters = {
  signedOn: (date) => dateTimeFormatter(date, 'yyyy-MM-dd HH:mm:ss'),
  createdOn: (date) => dateTimeFormatter(date, 'yyyy-MM-dd HH:mm:ss'),
}

export const DetailsTab: React.FC<{
  member: Member
}> = ({ member }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [editMemberInfoRequest, setEditMemberInfoRequest] = useState({
    memberId: member.memberId,
  })
  const [editingFraud, setEditFraud] = useState(false)
  const [fraudStatus, setFraudStatus] = useState(null)
  const [fraudDescription, setFraudDescription] = useState(null)
  const [editMemberInfo] = useEditMemberInfo()
  const [setFraudulentStatus] = useSetFraudulentStatus()

  const handleOpen = () => setModalOpen(true)

  const handleClose = () => setModalOpen(false)

  const isDisabled = (field) => {
    switch (field.toLowerCase()) {
      case 'memberid':
      case 'personalnumber':
      case 'birthdate':
      case 'signedon':
      case 'status':
      case 'pickedlocale':
      case 'createdon':
        return true
      default:
        return false
    }
  }

  const handleChange = (field) => (e) => {
    const editedMemberDetails = { ...editMemberInfoRequest }
    editedMemberDetails[field] = e.target.value
    setEditMemberInfoRequest(editedMemberDetails)
  }

  const handleCancel = () => {
    setEditMemberInfoRequest({
      memberId: member.memberId,
    })
    handleClose()
  }

  const handleSubmissionButton = () => {
    editMemberInfo(getEditMemberInfoOptions(editMemberInfoRequest)).then(() =>
      handleClose(),
    )
  }

  const { fraudulentStatusDescription, fraudulentStatus, ...memberInfo } =
    member || {}

  const memberInfoWithoutSsn = {
    ...memberInfo,
    personalNumber: memberInfo.signedOn ? memberInfo.personalNumber : null,
  }

  delete memberInfoWithoutSsn.__typename
  delete memberInfoWithoutSsn.contractMarketInfo

  return memberInfoWithoutSsn ? (
    <FadeIn>
      <Table selectable>
        <Table.Body>
          <TableFields
            fields={memberInfoWithoutSsn}
            fieldFormatters={memberFieldFormatters}
          />
          <FraudulentStatusEdit
            getFraudStatusInfo={() => ({
              status: fraudStatus || fraudulentStatus,
              description: fraudDescription || fraudulentStatusDescription,
            })}
            setState={(val, fs, desc) => {
              setEditFraud(val)
              setFraudStatus(fs)
              setFraudDescription(desc)
            }}
            getState={() => editingFraud}
            action={(newFraudulentStatus, newFraudulentStatusDescription) => {
              toast.promise(
                setFraudulentStatus(
                  getSetFraudulentStatusOptions(memberInfo.memberId, {
                    fraudulentStatus: newFraudulentStatus,
                    fraudulentStatusDescription: newFraudulentStatusDescription,
                  }),
                ),
                {
                  loading: 'Updating fraudulent status',
                  success: 'Fraudulent status updated',
                  error: 'Could not update fraudulent status',
                },
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
                    onClick={() => handleOpen()}
                  >
                    <Icon name="edit" /> Edit Member
                  </Button>
                }
                open={modalOpen}
                onClose={() => handleClose()}
                basic
                size="small"
                dimmer="blurring"
              >
                <Header icon="edit" content="Edit Member" />
                <Modal.Content>
                  <Form inverted size="small">
                    <>
                      {Object.keys(memberInfoWithoutSsn).map((field) => (
                        <Form.Input
                          key={field}
                          label={getFieldName(field)}
                          disabled={isDisabled(field)}
                          defaultValue={getFieldValue(member[field])}
                          onChange={handleChange(field)}
                        />
                      ))}
                    </>
                    <Button.Group floated="right" labelposition="left">
                      <Button type="button" onClick={() => handleCancel()}>
                        Cancel
                      </Button>
                      <Button.Or />
                      <Button
                        type="button"
                        onClick={() => handleSubmissionButton()}
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
    </FadeIn>
  ) : (
    <Header>No member info</Header>
  )
}
