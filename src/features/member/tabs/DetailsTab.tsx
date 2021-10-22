import styled from '@emotion/styled'
import { FadeIn } from '@hedvig-ui'
import {
  getEditMemberInfoOptions,
  useEditMemberInfo,
} from 'graphql/use-edit-member-info'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Button, Form, Header, Icon, Modal, Table } from 'semantic-ui-react'
import { Member, useSetFraudulentStatusMutation } from 'types/generated/graphql'
import { FraudulentStatusEdit } from 'utils/fraudulentStatus'
import { dateTimeFormatter, getFieldName, getFieldValue } from 'utils/helpers'

const memberFieldFormatters = {
  signedOn: (date) => dateTimeFormatter(date, 'yyyy-MM-dd HH:mm:ss'),
  createdOn: (date) => dateTimeFormatter(date, 'yyyy-MM-dd HH:mm:ss'),
}

const isClient = typeof window !== 'undefined'

const WideModal = styled(Modal)`
  height: ${isClient ? window.innerHeight + 100 : '120%'};
`

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
  const [setFraudulentStatus] = useSetFraudulentStatusMutation()

  const handleOpen = () => setModalOpen(true)

  const handleClose = () => setModalOpen(false)

  const isDisabled = (field) => {
    switch (field.toLowerCase()) {
      case 'memberid':
      case 'personalnumber':
      case 'signedon':
      case 'status':
      case 'pickedlocale':
      case 'createdon':
        return true
      default:
        return false
    }
  }

  const setFieldValue = (field, value) => {
    const editedMemberDetails = { ...editMemberInfoRequest }
    editedMemberDetails[field] = value
    setEditMemberInfoRequest(editedMemberDetails)
  }

  const handleChange = (field) => (e) => {
    if (field === 'firstName' || field === 'lastName') {
      const value =
        e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
      setFieldValue(field, value)
    } else {
      setFieldValue(field, e.target.value)
    }
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
          {Object.keys(memberInfoWithoutSsn).map((field, id) => {
            const formatter = memberFieldFormatters[field]
            return (
              <Table.Row key={id}>
                <Table.Cell>{getFieldName(field)}</Table.Cell>
                <Table.Cell>
                  {formatter
                    ? formatter(memberInfoWithoutSsn[field])
                    : getFieldValue(memberInfoWithoutSsn[field])}
                </Table.Cell>
              </Table.Row>
            )
          })}
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
                setFraudulentStatus({
                  variables: {
                    memberId: memberInfo.memberId,
                    request: {
                      fraudulentStatus: newFraudulentStatus,
                      fraudulentStatusDescription: newFraudulentStatusDescription,
                    },
                  },
                }),
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
