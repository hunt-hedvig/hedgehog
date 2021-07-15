import { useMutation } from '@apollo/client'
import { gql } from '@apollo/client/core'
import styled from '@emotion/styled'
import {
  GetSwitcherEmailsDocument,
  Member,
  SwitchableSwitcherEmail,
  useGetSwitcherEmailsQuery,
  useMarkSwitcherEmailAsRemindedMutation,
} from 'api/generated/graphql'
import { format, parseISO } from 'date-fns'
import { Button, ButtonsGroup } from 'hedvig-ui/button'
import { Checkbox } from 'hedvig-ui/checkbox'
import { Input } from 'hedvig-ui/input'
import {
  FourthLevelHeadline,
  MainHeadline,
  SecondLevelHeadline,
} from 'hedvig-ui/typography'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import { WithShowNotification } from 'store/actions/notificationsActions'
import { Market, SwitcherEmailStatus, SwitcherTypeMarket } from 'types/enums'
import { Keys } from 'utils/hooks/key-press-hook'
import { withShowNotification } from 'utils/notifications'
import { getSwitcherEmailStatus } from 'utils/switcher-emails'
import { convertEnumToTitle, getFlagFromMarket } from 'utils/text'

const FORMAT_DATE_TIME = 'yyyy-MM-dd HH:mm'

export const StatusTableRow = styled(Table.Row)()

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
> & {
  status: SwitcherEmailStatus
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
  showNotification,
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
        {!editNote && (
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
        {editNote && (
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
        )}
      </Table.Cell>
    </StatusTableRow>
  )
}

export const SwitcherEmailRow = withShowNotification(SwitcherEmailRowComponent)

export const SwitcherAutomation: React.FC = () => {
  const switchers = useGetSwitcherEmailsQuery()

  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null)
  const [
    selectedStatus,
    setSelectedStatus,
  ] = useState<SwitcherEmailStatus | null>(null)

  return (
    <>
      <MainHeadline>🏡 Switcher automation</MainHeadline>
      {switchers.loading ? (
        <>Loading...</>
      ) : (
        <>
          <SecondLevelHeadline>Market</SecondLevelHeadline>
          {Object.values(Market).map((market) => {
            return (
              <div key={market}>
                <Checkbox
                  label={`${convertEnumToTitle(market)} ${getFlagFromMarket(
                    market,
                  )}`}
                  checked={selectedMarket === market}
                  onChange={() =>
                    setSelectedMarket((current) =>
                      current === market ? null : market,
                    )
                  }
                />
              </div>
            )
          })}
          <SecondLevelHeadline>Status</SecondLevelHeadline>
          {Object.values(SwitcherEmailStatus).map((status) => {
            return (
              <div key={status}>
                <Checkbox
                  label={status}
                  checked={selectedStatus === status}
                  onChange={() =>
                    setSelectedStatus((current) =>
                      current === status ? null : status,
                    )
                  }
                />
              </div>
            )
          })}
          <Table>
            <Table.Header>
              <StatusTableRow>
                <Table.HeaderCell>Member</Table.HeaderCell>
                <Table.HeaderCell>Insurance</Table.HeaderCell>
                <Table.HeaderCell>Sign date</Table.HeaderCell>
                <Table.HeaderCell>Sent date</Table.HeaderCell>
                <Table.HeaderCell>Status</Table.HeaderCell>
              </StatusTableRow>
            </Table.Header>
            <Table.Body>
              {switchers.data?.switchableSwitcherEmails
                ?.filter((email) => {
                  if (!selectedMarket && !selectedStatus) {
                    return true
                  }
                  if (!email.switcherType) {
                    return true
                  }
                  if (!SwitcherTypeMarket[email.switcherType]) {
                    return true
                  }
                  const status = getSwitcherEmailStatus(email)
                  return (
                    (!selectedMarket ||
                      SwitcherTypeMarket[email.switcherType] ===
                        selectedMarket) &&
                    (!selectedStatus || selectedStatus === status)
                  )
                })
                .map((email) => (
                  <SwitcherEmailRow
                    key={email.id}
                    {...email}
                    status={getSwitcherEmailStatus(email)}
                    member={email.member as Member}
                  />
                )) ?? null}
            </Table.Body>
          </Table>
        </>
      )}
    </>
  )
}
