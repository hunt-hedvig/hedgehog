import { useMutation } from '@apollo/client'
import { gql } from '@apollo/client/core'
import styled from '@emotion/styled'
import {
  Button,
  ButtonsGroup,
  Dropdown,
  DropdownOption,
  FourthLevelHeadline,
  Input,
  Label,
  TableColumn,
  TableRow,
  TextDatePicker,
} from '@hedvig-ui'
import { Keys } from '@hedvig-ui/utils/key-press-hook'
import { useConfirmDialog } from '@hedvig-ui/utils/modal-hook'
import { getTextFromEnumValue } from '@hedvig-ui/utils/text'
import { format, parseISO } from 'date-fns'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { SwitcherEmailStatus, TerminationReason } from 'types/enums'
import {
  Contract,
  GetSwitcherEmailsDocument,
  SwitchableSwitcherEmail,
  useMarkSwitcherEmailAsRemindedMutation,
} from 'types/generated/graphql'
import { convertEnumToTitle } from 'utils/text'

const FORMAT_DATE_TIME = 'yyyy-MM-dd HH:mm'

const StatusTableRow = styled(TableRow)`
  height: 115px;
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
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 2;
  background-color: ${({ theme }) => theme.accentLighter};
`

const OverlayItem = styled.div`
  margin: 0 1em;
`

const Note = styled.div`
  font-size: 1rem;
  margin: 0.5rem 0;
`

export const SwitcherEmailRow: React.FC<Pick<
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
}> = ({
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
  const [newNote, setNewNote] = useState<string>(note || '')

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

  const { confirm } = useConfirmDialog()

  return (
    <StatusTableRow border>
      <TableColumn>
        <Link to={`/members/${member.memberId}`}>{member.memberId}</Link>
        <>
          {' '}
          ({member.firstName} {member.lastName})
          <SubText>{member.email}</SubText>
        </>
      </TableColumn>
      <TableColumn>
        {convertEnumToTitle(switcherCompany)}
        <SubText>
          {switcherType ? convertEnumToTitle(switcherType) : 'Unknown'}
        </SubText>
      </TableColumn>
      <TableColumn>
        {'📝 '}
        {signedDate ? format(signedDate, FORMAT_DATE_TIME) : '-'}
      </TableColumn>
      <TableColumn>
        {'💌 '}
        {sentAtDate ? format(sentAtDate, FORMAT_DATE_TIME) : '-'}
        {cancellationDate && (
          <SubText>with cancellation date {cancellationDate}</SubText>
        )}
      </TableColumn>
      <TableColumn>
        <FourthLevelHeadline>{status}</FourthLevelHeadline>
        {editNote ? (
          <>
            <Input
              autoFocus
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.keyCode === Keys.Escape.code) {
                  if (note) {
                    setEditNote(false)
                    setNewNote(note || '')
                  }
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

                toast.promise(
                  updateSwitcherEmailInfo({
                    variables: {
                      id,
                      input: {
                        note: newNote,
                      },
                    },
                  }),
                  {
                    loading: 'Saving note',
                    success: () => {
                      setEditNote(false)
                      return 'Note saved'
                    },
                    error: 'Could not save note',
                  },
                )
              }}
            />
          </>
        ) : (
          <>
            <Note>{note}</Note>
            <ButtonsGroup>
              <Button
                size="small"
                onClick={() => setEditNote((current) => !current)}
              >
                Toggle note edit
              </Button>
              <Button
                size="small"
                variant="secondary"
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
      </TableColumn>
      <TableColumn>
        {contract && (
          <>
            <ButtonsGroup>
              <Button
                status="success"
                onClick={() => setActivateContractView(true)}
              >
                Activate
              </Button>
              <Button
                status="danger"
                onClick={() => setTerminateContractView(true)}
              >
                Terminate
              </Button>
            </ButtonsGroup>
            {activateContractView && (
              <Overlay>
                <OverlayItem>
                  <Label>Master Inception</Label>
                  <TextDatePicker
                    onChange={(date) => date && setActiveFrom(date)}
                    value={activeFrom}
                  />
                </OverlayItem>
                <OverlayItem>
                  <Label>&nbsp;</Label>
                  <ButtonsGroup>
                    <Button
                      status="success"
                      disabled={loading}
                      onClick={() => {
                        const confirmMessage = `Are you sure you want to activate this contract with master inception of ${format(
                          activeFrom,
                          'yyyy-MM-dd',
                        )}?`

                        confirm(confirmMessage).then(() => {
                          onActivate(contract, activeFrom)
                          setActivateContractView(false)
                        })
                      }}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="tertiary"
                      onClick={() => setActivateContractView(false)}
                    >
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
                  <TextDatePicker
                    value={terminationDate}
                    onChange={(date) => date && setTerminationDate(date)}
                  />
                </OverlayItem>
                <OverlayItem>
                  <Label>Termination Reason</Label>
                  <Dropdown placeholder="Reasons" style={{ width: 300 }}>
                    {Object.keys(TerminationReason).map((reason) => (
                      <DropdownOption
                        selected={
                          terminationReason === TerminationReason[reason]
                        }
                        onClick={() =>
                          setTerminationReason(TerminationReason[reason])
                        }
                      >
                        {getTextFromEnumValue(TerminationReason[reason])}
                      </DropdownOption>
                    ))}
                  </Dropdown>
                </OverlayItem>
                <OverlayItem>
                  <Label>Termination Reason</Label>
                  <Input
                    placeholder="Comment on the reason of termination..."
                    value={comment}
                    onChange={(e) => setComment(e.currentTarget.value)}
                  />
                </OverlayItem>
                <OverlayItem>
                  <Label>&nbsp;</Label>
                  <ButtonsGroup>
                    <Button
                      status="danger"
                      disabled={terminationReason === null || loading}
                      onClick={() => {
                        const confirmMessage = `Are you sure you want to terminate this contract with the termination date ${format(
                          terminationDate,
                          'yyyy-MM-dd',
                        )}?`

                        confirm(confirmMessage).then(() => {
                          if (terminationReason) {
                            onTerminate(
                              contract,
                              terminationDate,
                              terminationReason,
                              comment,
                            )
                            setTerminateContractView(false)
                          }
                        })
                      }}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="tertiary"
                      onClick={() => setTerminateContractView(false)}
                    >
                      Cancel
                    </Button>
                  </ButtonsGroup>
                </OverlayItem>
              </Overlay>
            )}
          </>
        )}
      </TableColumn>
    </StatusTableRow>
  )
}
