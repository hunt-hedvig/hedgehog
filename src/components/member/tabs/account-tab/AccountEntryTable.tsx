import styled from '@emotion/styled'
import { AccountEntry } from 'api/generated/graphql'
import { Popover } from 'hedvig-ui/popover'
import { Bold, Capitalized } from 'hedvig-ui/typography'
import React from 'react'
import { InfoCircleFill } from 'react-bootstrap-icons'
import { Grid, Table } from 'semantic-ui-react'
import { formatMoney } from 'utils/money'

const getAccountEntryColor = (theme, entry: AccountEntry) => {
  if (entry.failedAt) {
    return theme.lightDanger
  }

  if (entry.chargedAt && entry.type === 'CHARGE') {
    return theme.lightSuccess
  }

  if (parseFloat(entry.amount.amount) < 0) {
    return theme.lightWarning
  }

  return theme.backgroundTransparent
}

const TableRowColored = styled(Table.Row)<{
  entry: AccountEntry
}>`
  td {
    background-color: ${({ theme, entry }) =>
      getAccountEntryColor(theme, entry)} !important;
  }
`

const StyledTable = styled(Table)`
  overflow: visible !important;
`

const AmountCell = styled(Table.Cell)<{
  entry: AccountEntry
}>`
  text-decoration: ${({ entry }) => (entry.failedAt ? 'line-through' : '')};
`

export const AccountEntryTable: React.FC<{
  accountEntries: AccountEntry[]
}> = ({ accountEntries }) => (
  <StyledTable>
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
        <TableRowColored entry={entry} key={entry.id}>
          <Table.Cell entry={entry}>{entry.fromDate}</Table.Cell>
          <Table.Cell>
            <Capitalized>{entry.type}</Capitalized>
          </Table.Cell>
          <Table.Cell>
            {entry.title && entry.title !== '' ? entry.title : 'Not specified'}
          </Table.Cell>
          <AmountCell entry={entry}>
            {formatMoney(entry.amount, {
              useGrouping: true,
              minimumFractionDigits: 2,
            })}
          </AmountCell>
          <Table.Cell textAlign="center">
            <Popover
              contents={
                <Grid>
                  <Grid.Row>
                    <Grid.Column>
                      <Bold>Entry ID</Bold>
                      <br />
                      {entry.id}
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <Bold>Reference</Bold>
                      <br />
                      {entry.reference}
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row>
                    <Grid.Column>
                      <Bold>Source</Bold>
                      <br />
                      {entry.source}
                    </Grid.Column>
                  </Grid.Row>
                  {entry.comment && (
                    <Grid.Row>
                      <Grid.Column>
                        <Bold>Comment</Bold>
                        <br />
                        {entry.comment}
                      </Grid.Column>
                    </Grid.Row>
                  )}
                </Grid>
              }
            >
              <InfoCircleFill />
            </Popover>
          </Table.Cell>
        </TableRowColored>
      ))}
    </Table.Body>
  </StyledTable>
)
