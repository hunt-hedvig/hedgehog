import styled from '@emotion/styled'
import {
  Bold,
  Button,
  Capitalized,
  Popover,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import { formatMoney } from '@hedvig-ui/utils/money'
import { format, parseISO } from 'date-fns'
import React, { useState } from 'react'
import { InfoCircleFill, Trash } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import {
  GetAccountDocument,
  MonthlyEntry,
  useRemoveMonthlyEntryMutation,
} from 'types/generated/graphql'

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
  navigationAvailable: boolean
}> = ({ memberId, monthlyEntries, navigationAvailable }) => {
  const [removeMonthlyEntry] = useRemoveMonthlyEntryMutation()
  const { confirm } = useConfirmDialog()
  const [activeRow, setActiveRow] = useState<number | null>(null)

  return (
    <StyledTable>
      <TableHeader>
        <TableHeaderColumn>External Id</TableHeaderColumn>
        <TableHeaderColumn>Source</TableHeaderColumn>
        <TableHeaderColumn>Title</TableHeaderColumn>
        <TableHeaderColumn>Type</TableHeaderColumn>
        <TableHeaderColumn>Amount</TableHeaderColumn>
        <TableHeaderColumn style={{ textAlign: 'center', width: 90 }}>
          Details
        </TableHeaderColumn>
        <TableHeaderColumn style={{ width: 43 }} />
      </TableHeader>
      <TableBody
        isActive={navigationAvailable}
        setActiveRow={(num) => setActiveRow(num)}
        onPerformNavigation={() => {
          return
        }}
      >
        {monthlyEntries.map((monthlyEntry, index) => {
          return (
            <TableRow key={monthlyEntry.id} border active={activeRow === index}>
              <TableColumn>{monthlyEntry.externalId ?? 'None'}</TableColumn>
              <TableColumn>
                <Capitalized>{monthlyEntry.source}</Capitalized>
              </TableColumn>
              <TableColumn>
                <Capitalized>{monthlyEntry.title}</Capitalized>
              </TableColumn>
              <TableColumn>
                <Capitalized>{monthlyEntry.type}</Capitalized>
              </TableColumn>
              <TableColumn>{formatMoney(monthlyEntry.amount)}</TableColumn>
              <TableColumn style={{ textAlign: 'center', width: 90 }}>
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
              </TableColumn>
              <TableColumn style={{ width: 43 }}>
                <Button
                  variant="secondary"
                  onClick={() => {
                    confirm(
                      `Are you sure you want delete the monthly entry titled "${monthlyEntry.title} (id=${monthlyEntry.id})?"`,
                    ).then(() => {
                      toast.promise(
                        removeMonthlyEntry({
                          variables: {
                            id: monthlyEntry.id,
                          },
                          refetchQueries: [
                            {
                              query: GetAccountDocument,
                              variables: { memberId },
                            },
                          ],
                        }),
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
              </TableColumn>
            </TableRow>
          )
        })}
      </TableBody>
    </StyledTable>
  )
}
