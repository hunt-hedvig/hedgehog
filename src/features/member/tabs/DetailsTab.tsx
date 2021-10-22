import styled from '@emotion/styled'
import {
  Button,
  ButtonsGroup,
  FadeIn,
  Form,
  FormInput,
  Label,
  Modal,
  SubmitButton,
  Table,
  TableColumn,
  TableRow,
} from '@hedvig-ui'
import {
  getEditMemberInfoOptions,
  useEditMemberInfo,
} from 'graphql/use-edit-member-info'
import React, { useState } from 'react'
import { PencilSquare } from 'react-bootstrap-icons'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import { Member, useSetFraudulentStatusMutation } from 'types/generated/graphql'
import { FraudulentStatusEdit } from 'utils/fraudulentStatus'
import { dateTimeFormatter, getFieldName, getFieldValue } from 'utils/helpers'

const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: 1em;
  display: flex;
  justify-content: flex-end;
`

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
  const [setFraudulentStatus] = useSetFraudulentStatusMutation()

  const form = useForm()

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

  const handleChange = (e) => {
    const editedMemberDetails = { ...editMemberInfoRequest }
    editedMemberDetails[e.target.name] = e.target.value
    setEditMemberInfoRequest(editedMemberDetails)
  }

  const handleCancel = () => {
    setEditMemberInfoRequest({
      memberId: member.memberId,
    })
    handleClose()
  }

  const handleSubmit = () => {
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
      <Table>
        {Object.keys(memberInfoWithoutSsn).map((field, id) => {
          const formatter = memberFieldFormatters[field]
          return (
            <TableRow key={id} border>
              <TableColumn>{getFieldName(field)}</TableColumn>
              <TableColumn>
                {formatter
                  ? formatter(memberInfoWithoutSsn[field])
                  : getFieldValue(memberInfoWithoutSsn[field])}
              </TableColumn>
            </TableRow>
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
      </Table>

      <ButtonWrapper style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button variant="primary" size="medium" onClick={handleOpen}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <PencilSquare /> <span style={{ marginLeft: 10 }}>Edit Member</span>
          </div>
        </Button>
      </ButtonWrapper>
      {modalOpen ? (
        <Modal
          onClose={handleClose}
          title="Edit Member"
          width="800px"
          height="950px"
          style={{ overflowY: 'auto' }}
        >
          <FormProvider {...form}>
            <Form onSubmit={handleSubmit} onChange={handleChange}>
              <>
                {Object.keys(memberInfoWithoutSsn).map((field) => (
                  <>
                    <Label>{getFieldName(field)}</Label>
                    <FormInput
                      name={field}
                      key={field}
                      disabled={isDisabled(field)}
                      defaultValue={getFieldValue(member[field])}
                    />
                  </>
                ))}
              </>
              <ButtonsGroup style={{ justifyContent: 'flex-end' }}>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <SubmitButton>Submit</SubmitButton>
              </ButtonsGroup>
            </Form>
          </FormProvider>
        </Modal>
      ) : null}
    </FadeIn>
  ) : (
    <h1>No member info</h1>
  )
}
