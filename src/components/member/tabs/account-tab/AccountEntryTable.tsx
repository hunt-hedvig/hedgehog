import { AccountEntry } from 'api/generated/graphql'
import { Capitalized } from 'components/member/tabs/shared/capitalized'
import { Placeholder } from 'components/member/tabs/shared/placeholder'
import { Popover } from 'hedvig-ui/popover'
import React from 'react'
import styled from 'react-emotion'
import { Grid, Icon, Table } from 'semantic-ui-react'
import { formatMoney } from 'utils/money'

const getAccountEntryColor = (theme, entry: AccountEntry) => {
  if (entry.failedAt) {
    return theme.danger
  }

  if (parseFloat(entry.amount.amount) < 0) {
    return theme.warning
  }

  return theme.backgroundTransparent
}

const FirstCell = styled(Table.Cell)<{ entry: AccountEntry }>`
  border-left: 7px solid
    ${({ theme, entry }) => getAccountEntryColor(theme, entry)} !important;
`

const DetailsIcon = styled(Icon)`
  color: ${({ theme }) => theme.accent};
`

export const AccountEntryTable: React.FC<{
  accountEntries: AccountEntry[]
}> = ({ accountEntries }) => {
  return (
    <Table style={{ overflow: 'visible' }}>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>Date</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Title</Table.HeaderCell>
          <Table.HeaderCell>Amount</Table.HeaderCell>
          <Table.HeaderCell width={1}>Details</Table.HeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Body>
        {accountEntries.map((entry) => (
          <Table.Row key={entry.id}>
            <FirstCell entry={entry}>{entry.fromDate}</FirstCell>
            <Table.Cell>
              <Capitalized>{entry.type}</Capitalized>
            </Table.Cell>
            <Table.Cell>
              {entry.title && entry.title !== '' ? (
                entry.title
              ) : (
                <Placeholder>Not specified</Placeholder>
              )}
            </Table.Cell>
            <Table.Cell>
              {formatMoney(entry.amount, {
                useGrouping: true,
                minimumFractionDigits: 2,
              })}
            </Table.Cell>
            <Table.Cell textAlign="center">
              <Popover
                contents={
                  <Grid>
                    <Grid.Row>
                      <Grid.Column>
                        <span style={{ fontWeight: 'bold' }}>Entry ID</span>
                        <br />
                        {entry.id}
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <span style={{ fontWeight: 'bold' }}>Reference</span>
                        <br />
                        {entry.reference}
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <span style={{ fontWeight: 'bold' }}>Source</span>
                        <br />
                        {entry.source}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                }
              >
                <DetailsIcon name="info circle" />
              </Popover>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  )
}