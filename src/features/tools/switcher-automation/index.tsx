import {
  GetSwitcherEmailsDocument,
  Member,
  SwitchableSwitcherEmail,
  useGetSwitcherEmailsQuery,
  useMarkSwitcherEmailAsRemindedMutation,
} from 'api/generated/graphql'
import { format, parseISO } from 'date-fns'
import { Button } from 'hedvig-ui/button'
import { MainHeadline } from 'hedvig-ui/typography'
import React from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'

const FORMAT_DATE_TIME = 'yyyy-MM-dd HH:mm'

export const StatusTableRow = styled(Table.Row)()

export const SwitcherEmailRow: React.FC<Pick<
  SwitchableSwitcherEmail,
  'id' | 'member' | 'sentAt' | 'remindedAt' | 'switcherCompany'
>> = ({ id, member, sentAt, remindedAt, switcherCompany }) => {
  const [
    markAsReminded,
    markAsRemindedOptions,
  ] = useMarkSwitcherEmailAsRemindedMutation({
    variables: { id },
    refetchQueries: () => [{ query: GetSwitcherEmailsDocument }],
  })

  const sentAtDate = sentAt && parseISO(sentAt)
  const remindedAtDate = remindedAt && parseISO(remindedAt)
  const signedDate = member.signedOn && parseISO(member.signedOn)

  return (
    <StatusTableRow>
      <Table.Cell>
        <Link to={`/members/${member.memberId}`}>{member.memberId}</Link>
        <>
          {' '}
          ({member.firstName} {member.lastName})
        </>
      </Table.Cell>
      <Table.Cell>{switcherCompany}</Table.Cell>
      <Table.Cell>
        {'📝 '}
        {signedDate ? format(signedDate, FORMAT_DATE_TIME) : '-'}
      </Table.Cell>
      <Table.Cell>
        {'💌 '}
        {sentAtDate ? format(sentAtDate, FORMAT_DATE_TIME) : '-'}
      </Table.Cell>
      <Table.Cell>
        {remindedAtDate ? (
          <>Reminded {format(remindedAtDate, FORMAT_DATE_TIME)}</>
        ) : (
          <Button
            size="small"
            variation="secondary"
            disabled={markAsRemindedOptions.loading}
            onClick={() => {
              if (
                confirm(
                  `Did you remind ${switcherCompany} about ${member.memberId}?`,
                )
              ) {
                markAsReminded()
              }
            }}
          >
            {markAsRemindedOptions.loading ? '...' : 'Mark as reminded'}
          </Button>
        )}
      </Table.Cell>
    </StatusTableRow>
  )
}

export const SwitcherAutomation: React.FC = () => {
  const switchers = useGetSwitcherEmailsQuery()

  return (
    <>
      <MainHeadline>🏡 Switcher automation</MainHeadline>
      {switchers.loading ? (
        <>Loading...</>
      ) : (
        <Table>
          <Table.Header>
            <StatusTableRow>
              <Table.HeaderCell>Member</Table.HeaderCell>
              <Table.HeaderCell>Current Insurer</Table.HeaderCell>
              <Table.HeaderCell>Sign date</Table.HeaderCell>
              <Table.HeaderCell>Sent date</Table.HeaderCell>
              <Table.HeaderCell>Sent reminder</Table.HeaderCell>
            </StatusTableRow>
          </Table.Header>
          <Table.Body>
            {switchers.data?.switchableSwitcherEmails?.map((email) => (
              <SwitcherEmailRow
                key={email.id}
                {...email}
                member={email.member as Member}
              />
            )) ?? null}
          </Table.Body>
        </Table>
      )}
    </>
  )
}
