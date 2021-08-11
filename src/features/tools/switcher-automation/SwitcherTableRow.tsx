import { useMutation } from '@apollo/client'
import { gql } from '@apollo/client/core'
import styled from '@emotion/styled'
import {
  Contract,
  GetSwitcherEmailsDocument,
  SwitchableSwitcherEmail,
  useMarkSwitcherEmailAsRemindedMutation,
} from 'api/generated/graphql'
import { format, parseISO } from 'date-fns'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { DateTimePicker } from 'hedvig-ui/date-time-picker'
import { EnumDropdown } from 'hedvig-ui/dropdown'
import { Input } from 'hedvig-ui/input'
import { FourthLevelHeadline, Label } from 'hedvig-ui/typography'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { SwitcherEmailStatus, TerminationReason } from 'types/enums'
import { Keys } from 'utils/hooks/key-press-hook'
import { withShowNotification } from 'utils/notifications'
import { convertEnumToTitle } from 'utils/text'

const FORMAT_DATE_TIME = 'yyyy-MM-dd HH:mm'

export const StatusTableRow = styled(Table.Row)`
  position: relative;
`

const SubText = styled.p`
  font-size: 0.9rem;
`

const UPDATE_INFO = gql`
  mutation UpdateSwitcherEmailInfo(
    $id: ID!
    $input: UpdateSwitcherEmailInfoInput
  ) {
    updateSwitcherEmailInfo(id: $id, request: $input) {
      id
      note
    }
  }
`

const Overlay = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: inherit;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
`

const OverlayItem = styled.div`
  margin: 0 1em;
`

const Note = styled.div`
  font-size: 1rem;
  margin: 0.5rem 0;
`

const SwitcherEmailRowComponent: React.FC<Pick<
  SwitchableSwitcherEmail,
  | 'id'
  | 'member'
  | 'sentAt'
  | 'remindedAt'
  | 'switcherCompany'
  | 'switcherType'
  | 'cancellationDate'
  | 'note'
  | 'contract'
> & {
  status: SwitcherEmailStatus
  onTerminate: (
    contract: Contract,
    terminationDate: Date,
    terminationReason: TerminationReason,
    comment: string,
  ) => void
  onActivate: (contract: Contract, activeFrom: Date) => void
  loading?: boolean
} & WithShowNotification> = ({
  id,
  member,
  sentAt,
  remindedAt,
  switcherCompany,
  switcherType,
  cancellationDate,
  note,
  status,
  contract,
  showNotification,
  onTerminate,
  onActivate,
  loading = false,
}) => {
  const [
    markAsReminded,
    markAsRemindedOptions,
  ] = useMarkSwitcherEmailAsRemindedMutation({
    variables: { id },
    refetchQueries: () => [{ query: GetSwitcherEmailsDocument }],
  })

  const [editNote, setEditNote] = useState(false)
  const [newNote, setNewNote] = useState(note)

  const [activeFrom, setActiveFrom] = useState(new Date())
  const [activateContractView, setActivateContractView] = useState(false)

  const [terminateContractView, setTerminateContractView] = useState(false)
  const [terminationDate, setTerminationDate] = useState(new Date())
  const [
    terminationReason,
    setTerminationReason,
  ] = useState<TerminationReason | null>(null)
  const [comment, setComment] = React.useState('')

  const sentAtDate = sentAt && parseISO(sentAt)
  const remindedAtDate = remindedAt && parseISO(remindedAt)
  const signedDate = member.signedOn && parseISO(member.signedOn)

  const [updateSwitcherEmailInfo] = useMutation(UPDATE_INFO)

  return (
    <StatusTableRow>
      <Table.Cell>
        <Link to={`/members/${member.memberId}`}>{member.memberId}</Link>
        <>
          {' '}
          ({member.firstName} {member.lastName})
          <SubText>{member.email}</SubText>
        </>
      </Table.Cell>
      <Table.Cell>
        {convertEnumToTitle(switcherCompany)}
        <SubText>
          {switcherType ? convertEnumToTitle(switcherType) : 'Unknown'}
        </SubText>
      </Table.Cell>
      <Table.Cell>
        {'📝 '}
        {signedDate ? format(signedDate, FORMAT_DATE_TIME) : '-'}
      </Table.Cell>
      <Table.Cell>
        {'💌 '}
        {sentAtDate ? format(sentAtDate, FORMAT_DATE_TIME) : '-'}
        {cancellationDate && (
          <SubText>with cancellation date {cancellationDate}</SubText>
        )}
      </Table.Cell>
      <Table.Cell width={5}>
        <FourthLevelHeadline>{status}</FourthLevelHeadline>
        {editNote ? (
          <>
            <Input
              autofocus
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.keyCode === Keys.Escape.code) {
                  setEditNote(false)
                  setNewNote(note)
                  return
                }
                if (e.keyCode !== Keys.Enter.code) {
                  return
                }
                if (!newNote) {
                  return
                }
                if (note && note.trim() === newNote.trim()) {
                  return
                }
                updateSwitcherEmailInfo({
                  variables: {
                    id,
                    input: {
                      note: newNote,
                    },
                  },
                })
                  .then(() => {
                    showNotification({
                      message: `Note changed to "${newNote}"`,
                      header: 'Success!',
                      type: 'olive',
                    })
                    setEditNote(false)
                  })
                  .catch((error) => {
                    showNotification({
                      message: error.message,
                      header: 'Error',
                      type: 'red',
                    })
                    throw error
                  })
              }}
            />
          </>
        ) : (
          <>
            <Note>{note}</Note>
            <ButtonsGroup>
              <Button
                size="small"
                variation="primary"
                onClick={() => setEditNote((current) => !current)}
              >
                Toggle note edit
              </Button>
              <Button
                size="small"
                variation="secondary"
                disabled={!!remindedAtDate || markAsRemindedOptions.loading}
                onClick={async () => {
                  if (
                    confirm(
                      `Did you remind ${convertEnumToTitle(
                        switcherCompany,
                      )} about ${member.firstName} ${member.lastName} (${
                        member.memberId
                      })?`,
                    )
                  ) {
                    await markAsReminded()
                  }
                }}
              >
                {markAsRemindedOptions.loading
                  ? '...'
                  : remindedAtDate
                  ? `Reminded ${format(remindedAtDate, FORMAT_DATE_TIME)}`
                  : 'Mark as reminded'}
              </Button>
            </ButtonsGroup>
          </>
        )}
      </Table.Cell>
      <Table.Cell>
        {contract && (
          <>
            <ButtonsGroup>
              <Button
                variation={'success'}
                onClick={() => setActivateContractView(true)}
              >
                Activate
              </Button>
              <Button
                variation={'danger'}
                onClick={() => setTerminateContractView(true)}
              >
                Terminate
              </Button>
            </ButtonsGroup>
            {activateContractView && (
              <Overlay>
                <OverlayItem>
                  <Label>Master Inception</Label>
                  <DateTimePicker date={activeFrom} setDate={setActiveFrom} />
                </OverlayItem>
                <OverlayItem>
                  <Label>&nbsp;</Label>
                  <ButtonsGroup>
                    <Button
                      variation={'success'}
                      disabled={loading}
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to activate this contract with master inception of ${format(
                              activeFrom,
                              'yyyy-MM-dd',
                            )}?`,
                          )
                        ) {
                          onActivate(contract, activeFrom)
                          setActivateContractView(false)
                        }
                      }}
                    >
                      Confirm
                    </Button>
                    <Button onClick={() => setActivateContractView(false)}>
                      Cancel
                    </Button>
                  </ButtonsGroup>
                </OverlayItem>
              </Overlay>
            )}
            {terminateContractView && (
              <Overlay>
                <OverlayItem>
                  <Label>Termination Date</Label>
                  <DateTimePicker
                    date={terminationDate}
                    setDate={setTerminationDate}
                  />
                </OverlayItem>
                <OverlayItem>
                  <Label>Termination Reason</Label>
                  <EnumDropdown
                    enumToSelectFrom={TerminationReason}
                    placeholder={''}
                    onChange={setTerminationReason}
                  />
                </OverlayItem>
                <OverlayItem>
                  <Label>Termination Reason</Label>
                  <Input
                    placeholder={'Comment on the reason of termination...'}
                    value={comment}
                    onChange={(e) => setComment(e.currentTarget.value)}
                  />
                </OverlayItem>
                <OverlayItem>
                  <Label>&nbsp;</Label>
                  <ButtonsGroup>
                    <Button
                      variation={'danger'}
                      disabled={terminationReason === null || loading}
                      onClick={() => {
                        if (
                          window.confirm(
                            `Are you sure you want to terminate this contract with the termination date ${format(
                              terminationDate,
                              'yyyy-MM-dd',
                            )}?`,
                          )
                        ) {
                          if (terminationReason) {
                            onTerminate(
                              contract,
                              terminationDate,
                              terminationReason,
                              comment,
                            )
                            setTerminateContractView(false)
                          }
                        }
                      }}
                    >
                      Confirm
                    </Button>
                    <Button onClick={() => setTerminateContractView(false)}>
                      Cancel
                    </Button>
                  </ButtonsGroup>
                </OverlayItem>
              </Overlay>
            )}
          </>
        )}
      </Table.Cell>
    </StatusTableRow>
  )
}

export const SwitcherEmailRow = withShowNotification(SwitcherEmailRowComponent)
