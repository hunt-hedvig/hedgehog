import styled from '@emotion/styled'
import {
  GetSwitcherEmailsDocument,
  Member,
  SwitchableSwitcherEmail,
  useGetSwitcherEmailsQuery,
  useMarkSwitcherEmailAsRemindedMutation,
} from 'api/generated/graphql'
import { format, parseISO } from 'date-fns'
import { Button } from 'hedvig-ui/button'
import { Checkbox } from 'hedvig-ui/checkbox'
import { MainHeadline } from 'hedvig-ui/typography'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import { Market, SwitcherTypeMarket } from 'types/enums'
import { convertEnumToTitle, getFlagFromMarket } from 'utils/text'

const FORMAT_DATE_TIME = 'yyyy-MM-dd HH:mm'

export const StatusTableRow = styled(Table.Row)()

const SubText = styled.p`
  font-size: 0.9rem;
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
>> = ({
  id,
  member,
  sentAt,
  remindedAt,
  switcherCompany,
  switcherType,
  cancellationDate,
}) => {
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
      <Table.Cell>
        {remindedAtDate ? (
          <>Reminded {format(remindedAtDate, FORMAT_DATE_TIME)}</>
        ) : (
          <Button
            size="small"
            variation="secondary"
            disabled={markAsRemindedOptions.loading}
            onClick={async () => {
              if (
                confirm(
                  `Did you remind ${switcherCompany} about ${member.memberId}?`,
                )
              ) {
                await markAsReminded()
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

  const [selectedMarket, setSelectedMarket] = useState<Market | null>(null)

  return (
    <>
      <MainHeadline>🏡 Switcher automation</MainHeadline>
      {switchers.loading ? (
        <>Loading...</>
      ) : (
        <>
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
          <Table>
            <Table.Header>
              <StatusTableRow>
                <Table.HeaderCell>Member</Table.HeaderCell>
                <Table.HeaderCell>Insurance</Table.HeaderCell>
                <Table.HeaderCell>Sign date</Table.HeaderCell>
                <Table.HeaderCell>Sent date</Table.HeaderCell>
                <Table.HeaderCell>Sent reminder</Table.HeaderCell>
              </StatusTableRow>
            </Table.Header>
            <Table.Body>
              {switchers.data?.switchableSwitcherEmails
                ?.filter((email) => {
                  if (!selectedMarket) {
                    return true
                  }
                  if (!email.switcherType) {
                    return true
                  }
                  if (!SwitcherTypeMarket[email.switcherType]) {
                    return true
                  }
                  return (
                    SwitcherTypeMarket[email.switcherType] === selectedMarket
                  )
                })
                .map((email) => (
                  <SwitcherEmailRow
                    key={email.id}
                    {...email}
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
