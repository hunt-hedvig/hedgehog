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
import { dateTimeFormatter } from '@hedvig-ui/utils/date'
import React, { useState } from 'react'
import { PencilSquare } from 'react-bootstrap-icons'
import { FormProvider, useForm } from 'react-hook-form'
import { toast } from 'react-hot-toast'
import {
  EditMemberInfoInput,
  EditMemberInformationQuery,
  GetMemberInfoDocument,
  useEditMemberInfoMutation,
  useEditMemberInformationQuery,
  useSetFraudulentStatusMutation,
} from 'types/generated/graphql'
import { FraudulentStatusEdit } from 'portals/hope/features/member/tabs/member-tab/FraudulentStatus'
import gql from 'graphql-tag'

const ButtonWrapper = styled.div`
  width: 100%;
  margin-top: 1em;
  display: flex;
  justify-content: flex-end;
`

const memberFieldFormatters: Record<
  'signedOn' | 'createdOn',
  (date: string) => string | undefined | 0
> = {
  signedOn: (date: string) => dateTimeFormatter(date, 'yyyy-MM-dd HH:mm:ss'),
  createdOn: (date: string) => dateTimeFormatter(date, 'yyyy-MM-dd HH:mm:ss'),
}

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

const getFieldName = (field: string) =>
  capitalize(
    field
      ?.match(/([A-Z]?[^A-Z]*)/g)
      ?.slice(0, -1)
      ?.join(' ') ?? '',
  )

const getFieldValue = (value: string | string[]): string => {
  if (!value) {
    return ''
  }

  if (value && typeof value === 'object' && value.constructor === Object) {
    return 'N/A'
  }

  if (Array.isArray(value)) {
    return value.join(', ')
  }

  return value.toString()
}

gql`
  query EditMemberInformation($memberId: ID!) {
    member(id: $memberId) {
      memberId
      email
      phoneNumber
      firstName
      lastName
      birthDate
      personalNumber
      status
      signedOn
      createdOn
      pickedLocale
      fraudulentStatus
      fraudulentStatusDescription
    }
  }
`

export const MemberTab: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const { data } = useEditMemberInformationQuery({ variables: { memberId } })

  const member = data?.member

  const [modalOpen, setModalOpen] = useState(false)
  const [editMemberInfoRequest, setEditMemberInfoRequest] =
    useState<EditMemberInfoInput>({
      memberId,
    })
  const [editingFraud, setEditFraud] = useState<boolean>(false)
  const [fraudStatus, setFraudStatus] = useState<string | null>(null)
  const [fraudDescription, setFraudDescription] = useState<string | null>(null)
  const [editMemberInfo] = useEditMemberInfoMutation()
  const [setFraudulentStatus] = useSetFraudulentStatusMutation()

  const form = useForm()

  if (!member) {
    return null
  }

  const handleOpen = () => setModalOpen(true)

  const handleClose = () => setModalOpen(false)

  const isDisabled = (field: string) => {
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

  const setFieldValue = (field: string, value: string) => {
    setEditMemberInfoRequest({ ...editMemberInfoRequest, [field]: value })
  }

  const handleChange = (field: string, value: string) => {
    if (field === 'firstName' || field === 'lastName') {
      setFieldValue(field, value.charAt(0).toUpperCase() + value.slice(1))
    } else {
      setFieldValue(field, value)
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

  const memberInfoWithoutSsn: EditMemberInformationQuery['member'] = {
    ...member,
    personalNumber: member?.signedOn ? member?.personalNumber : null,
  }

  delete memberInfoWithoutSsn.__typename
  delete memberInfoWithoutSsn.fraudulentStatus
  delete memberInfoWithoutSsn.fraudulentStatusDescription

  return memberInfoWithoutSsn ? (
    <FadeIn>
      <Table>
        <TableBody>
          {Object.keys(memberInfoWithoutSsn).map((field, id) => {
            const isDate = field === ('createdOn' || 'signedOn')

            return (
              <TableRow key={id} border>
                <TableColumn>{getFieldName(field)}</TableColumn>
                <TableColumn>
                  {isDate
                    ? memberFieldFormatters[field](memberInfoWithoutSsn[field])
                    : getFieldValue(
                        memberInfoWithoutSsn[
                          field as keyof EditMemberInformationQuery['member']
                        ],
                      )}
                </TableColumn>
              </TableRow>
            )
          })}
          <FraudulentStatusEdit
            getFraudStatusInfo={() => ({
              status: fraudStatus || member.fraudulentStatus || '',
              description:
                fraudDescription || member.fraudulentStatusDescription || '',
            })}
            setState={(val, fs, desc) => {
              setEditFraud(val)
              if (fs) {
                setFraudStatus(fs)
              }

              if (desc) {
                setFraudDescription(desc)
              }
            }}
            getState={() => editingFraud}
            onEdit={(newFraudulentStatus, newFraudulentStatusDescription) => {
              toast.promise(
                setFraudulentStatus({
                  variables: {
                    memberId,
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
        <Button variant="primary" size="medium" onClick={handleOpen}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <PencilSquare /> <span style={{ marginLeft: 10 }}>Edit Member</span>
          </div>
        </Button>
      </ButtonWrapper>
      {modalOpen && (
        <Modal
          onClose={handleClose}
          title="Edit Member"
          width="800px"
          height="950px"
          style={{ overflowY: 'auto' }}
        >
          <FormProvider {...form}>
            <Form onSubmit={handleSubmit}>
              <>
                {Object.keys(memberInfoWithoutSsn).map((field) => (
                  <React.Fragment key={field}>
                    <Label>{getFieldName(field)}</Label>
                    <FormInput
                      name={field}
                      key={field}
                      disabled={isDisabled(field)}
                      defaultValue={getFieldValue(
                        member[
                          field as keyof EditMemberInformationQuery['member']
                        ],
                      )}
                      onChange={(event) => {
                        handleChange(field, event.target.value)
                      }}
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
                <SubmitButton>Submit</SubmitButton>
              </ButtonsGroup>
            </Form>
          </FormProvider>
        </Modal>
      )}
    </FadeIn>
  ) : (
    <h1>No member info</h1>
  )
}
