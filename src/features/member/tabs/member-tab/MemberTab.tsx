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
  TableBody,
  TableColumn,
  TableRow,
} from '@hedvig-ui'
import { useArrowKeyboardNavigation } from '@hedvig-ui/hooks/keyboard/use-arrow-keyboard-navigation'
import { isPressing, Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { dateTimeFormatter } from '@hedvig-ui/utils/date'
import { FraudulentStatusEdit } from 'features/member/tabs/member-tab/FraudulentStatus'
import {
  FocusItems,
  useFocus,
  useNavigation,
} from 'features/navigation/hooks/use-navigation'
import React, { useState } from 'react'
import { PencilSquare } from 'react-bootstrap-icons'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import {
  GetMemberInfoDocument,
  Member,
  useEditMemberInfoMutation,
  useSetFraudulentStatusMutation,
} from 'types/generated/graphql'

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

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const getFieldName = (field) =>
  capitalize(
    field
      .match(/([A-Z]?[^A-Z]*)/g)
      .slice(0, -1)
      .join(' '),
  )

const getFieldValue = (value) => {
  if (!value) {
    return ''
  }
  if (Array.isArray(value)) {
    return value.join(', ')
  }
  if (value && typeof value === 'object' && value.constructor === Object) {
    return Object.keys(value).map((key) => `${key}: ${value[key]}, `)
  }
  return value.toString()
}

export const MemberTab: React.FC<{
  member: Member
}> = ({ member }) => {
  const [modalOpen, setModalOpen] = useState(false)
  const [editMemberInfoRequest, setEditMemberInfoRequest] = useState({
    memberId: member.memberId,
  })
  const [editingFraud, setEditFraud] = useState(false)
  const [fraudStatus, setFraudStatus] = useState(null)
  const [fraudDescription, setFraudDescription] = useState(null)
  const [editMemberInfo] = useEditMemberInfoMutation()
  const [setFraudulentStatus] = useSetFraudulentStatusMutation()

  useFocus(FocusItems.Member.items.Member)

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

  const setFieldValue = (field, value) => {
    const editedMemberDetails = { ...editMemberInfoRequest }
    editedMemberDetails[field] = value
    setEditMemberInfoRequest(editedMemberDetails)
  }

  const handleChange = (e) => {
    const field = e.target.name

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

  const handleSubmit = () => {
    editMemberInfo({
      variables: {
        request: editMemberInfoRequest,
      },
      refetchQueries: [
        {
          query: GetMemberInfoDocument,
          variables: {
            memberId: editMemberInfoRequest.memberId,
          },
        },
      ],
    }).then(() => handleClose())
  }

  const { fraudulentStatusDescription, fraudulentStatus, ...memberInfo } =
    member || {}

  const memberInfoWithoutSsn = {
    ...memberInfo,
    personalNumber: memberInfo.signedOn ? memberInfo.personalNumber : null,
  }

  delete memberInfoWithoutSsn.__typename
  delete memberInfoWithoutSsn.contractMarketInfo

  const { focus } = useNavigation()

  useFocus(FocusItems.Member.items.Member)

  const [navigationStep] = useArrowKeyboardNavigation({
    maxStep: Object.keys(memberInfoWithoutSsn).length - 1,
    isActive: focus === FocusItems.Main.items.Modal,
    onPerformNavigation: () => {
      return
    },
    withNegative: true,
    direction: 'vertical',
  })

  return memberInfoWithoutSsn ? (
    <FadeIn>
      <Table>
        <TableBody>
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
                      fraudulentStatusDescription:
                        newFraudulentStatusDescription,
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
        </TableBody>
      </Table>

      <ButtonWrapper style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="primary"
          size="medium"
          onClick={handleOpen}
          focus={focus === FocusItems.Member.items.Member}
        >
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
                {Object.keys(memberInfoWithoutSsn).map((field, index) => (
                  <React.Fragment key={field}>
                    <Label>{getFieldName(field)}</Label>
                    <FormInput
                      style={{
                        border:
                          navigationStep === index - 1
                            ? '1px solid blue'
                            : 'none',
                      }}
                      name={field}
                      key={field}
                      disabled={isDisabled(field)}
                      focus={!isDisabled(field) && navigationStep === index - 1}
                      defaultValue={getFieldValue(member[field])}
                    />
                  </React.Fragment>
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
                <SubmitButton
                  onKeyDown={(e) => {
                    if (isPressing(e, Keys.Enter)) {
                      handleSubmit()
                    }
                  }}
                  focus={
                    navigationStep ===
                    Object.keys(memberInfoWithoutSsn).length - 1
                  }
                >
                  Submit
                </SubmitButton>
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
