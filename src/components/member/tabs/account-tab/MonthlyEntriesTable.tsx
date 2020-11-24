import { MonthlyEntry } from 'api/generated/graphql'
import { format, parseISO } from 'date-fns'
import { Popover } from 'hedvig-ui/popover'
import { Bold, Capitalized } from 'hedvig-ui/typography'
import React from 'react'
import styled from 'react-emotion'
import { Grid, Icon, Table } from 'semantic-ui-react'
import { formatMoney } from 'utils/money'

const DetailsIcon = styled(Icon)`
  color: ${({ theme }) => theme.accent};
`

const StyledTable = styled(Table)`
  overflow: visible !important;
`

export const MonthlyEntriesTable: React.FC<{
  monthlyEntries: ReadonlyArray<MonthlyEntry>
}> = ({ monthlyEntries }) => {
  return (
    <StyledTable>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>External Id</Table.HeaderCell>
          <Table.HeaderCell>Source</Table.HeaderCell>
          <Table.HeaderCell>Title</Table.HeaderCell>
          <Table.HeaderCell>Type</Table.HeaderCell>
          <Table.HeaderCell>Amount</Table.HeaderCell>
          <Table.HeaderCell width={1}>Details</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {monthlyEntries.map((monthlyEntry) => {
          return (
            <Table.Row key={monthlyEntry.id}>
              <Table.Cell>{monthlyEntry.externalId ?? 'None'}</Table.Cell>
              <Table.Cell>
                <Capitalized>{monthlyEntry.source}</Capitalized>
              </Table.Cell>
              <Table.Cell>
                <Capitalized>{monthlyEntry.title}</Capitalized>
              </Table.Cell>
              <Table.Cell>
                <Capitalized>{monthlyEntry.type}</Capitalized>
              </Table.Cell>
              <Table.Cell>{formatMoney(monthlyEntry.amount)}</Table.Cell>
              <Table.Cell textAlign="center">
                <Popover
                  contents={
                    <Grid>
                      <Grid.Row>
                        <Grid.Column>
                          <Bold>ID</Bold>
                          <br />
                          {monthlyEntry.id}
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column>
                          <Bold>Added At</Bold>
                          <br />
                          {format(
                            parseISO(monthlyEntry.addedAt),
                            'yyyy-MM-dd hh:mm:ss',
                          )}
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column>
                          <Bold>Added By</Bold>
                          <br />
                          {monthlyEntry.addedBy}
                        </Grid.Column>
                      </Grid.Row>
                      <Grid.Row>
                        <Grid.Column>
                          <Bold>Comment</Bold>
                          <br />
                          {monthlyEntry.comment}
                        </Grid.Column>
                      </Grid.Row>
                    </Grid>
                  }
                >
                  <DetailsIcon name="info circle" />
                </Popover>
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </StyledTable>
  )
}
