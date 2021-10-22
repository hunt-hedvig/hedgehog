import styled from '@emotion/styled'
import { Bold, Button, Capitalized, Popover } from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/utils/modal-hook'
import { format, parseISO } from 'date-fns'
import {
  getRemoveMonthlyEntryOptions,
  useRemoveMonthlyEntry,
} from 'graphql/use-remove-monthly-entry'
import React from 'react'
import { InfoCircleFill, Trash } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import { Table } from 'semantic-ui-react'
import { MonthlyEntry } from 'types/generated/graphql'
import { formatMoney } from 'utils/money'

const StyledTable = styled(Table)`
  overflow: visible !important;
`

const TrashIcon = styled(Trash)`
  height: 15px;
  width: 15px;
  color: ${({ theme }) => theme.danger};
`

export const PopoverItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 5px 10px;
`

export const MonthlyEntriesTable: React.FC<{
  memberId: string
  monthlyEntries: ReadonlyArray<MonthlyEntry>
}> = ({ memberId, monthlyEntries }) => {
  const [removeMonthlyEntry] = useRemoveMonthlyEntry()
  const { confirm } = useConfirmDialog()

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
          <Table.HeaderCell width={1} />
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
                    <>
                      <PopoverItem>
                        <Bold>ID:</Bold>
                        {monthlyEntry.id}
                      </PopoverItem>

                      <PopoverItem>
                        <Bold>Added At:</Bold>
                        {format(
                          parseISO(monthlyEntry.addedAt),
                          'yyyy-MM-dd HH:mm:ss',
                        )}
                      </PopoverItem>

                      <PopoverItem>
                        <Bold>Added By:</Bold>
                        {monthlyEntry.addedBy}
                      </PopoverItem>

                      <PopoverItem>
                        <Bold>Comment:</Bold>
                        {monthlyEntry.comment}
                      </PopoverItem>
                    </>
                  }
                >
                  <InfoCircleFill />
                </Popover>
              </Table.Cell>
              <Table.Cell>
                <Button
                  variant="secondary"
                  onClick={() => {
                    confirm(
                      `Are you sure you want delete the monthly entry titled "${monthlyEntry.title} (id=${monthlyEntry.id})?"`,
                    ).then(() => {
                      toast.promise(
                        removeMonthlyEntry(
                          getRemoveMonthlyEntryOptions(
                            memberId,
                            monthlyEntry.id,
                          ),
                        ),
                        {
                          loading: 'Removing monthly entry',
                          success: 'Monthly entry removed',
                          error: 'Could not remove monthly entry',
                        },
                      )
                    })
                  }}
                >
                  <TrashIcon />
                </Button>
              </Table.Cell>
            </Table.Row>
          )
        })}
      </Table.Body>
    </StyledTable>
  )
}
