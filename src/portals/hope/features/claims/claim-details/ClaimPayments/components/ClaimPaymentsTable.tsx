import React, { FC, useState } from 'react'
import styled from '@emotion/styled'
import {
  Capitalized,
  FadeIn,
  InfoTag,
  Label,
  Monetary,
  Paragraph,
  StandaloneMessage,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import copy from 'copy-to-clipboard'
import { toast } from 'react-hot-toast'
import { format, parseISO } from 'date-fns'
import { useClaimPayments } from '../hooks/use-claim-payments'

const ScrollX = styled.div`
  margin-bottom: 1em;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
`

const NoPaymentsMessage = styled(StandaloneMessage)`
  padding: 3em 0;
`

const ExGratiaTag = styled(InfoTag)`
  font-weight: bold;
  text-align: center;
`

const TableColumnSubtext = styled.span`
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const FlexVertically = styled.div`
  display: flex;
  flex-direction: column;
`

const Tip = styled(Paragraph)`
  text-align: right;
  font-size: 0.8em;
  color: ${({ theme }) => theme.semiStrongForeground};
`

const PaymentTableFooter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 2em;
`

const PaymentTotalWrapper = styled.div`
  display: flex;
  flex-direction: row;
  padding-left: 1em;
`

const TotalAmount = styled.div`
  display: flex;
  flex-direction: column;
`

const TotalDeductible = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 2em;
`

export const ClaimPaymentsTable: FC<{ claimId: string }> = ({ claimId }) => {
  const { payments, sortBy, setSortBy, totalAmount, totalDeductible } =
    useClaimPayments(claimId)

  const [tableHovered, setTableHovered] = useState(false)

  if (!payments.length) {
    return <NoPaymentsMessage>No payments have been made</NoPaymentsMessage>
  }

  return (
    <>
      <ScrollX>
        <Table
          style={{ fontSize: '0.8em' }}
          onMouseEnter={() => setTableHovered(true)}
          onMouseLeave={() => setTableHovered(false)}
        >
          <TableHeader>
            <TableHeaderColumn
              withSort
              sorting={sortBy.field === 'amount'}
              desc={sortBy.desc}
              onClick={() => setSortBy({ field: 'amount' })}
            >
              Amount
            </TableHeaderColumn>
            <TableHeaderColumn
              withSort
              sorting={sortBy.field === 'deductible'}
              desc={sortBy.desc}
              onClick={() => setSortBy({ field: 'deductible' })}
            >
              Deductible
            </TableHeaderColumn>
            <TableHeaderColumn
              withSort
              sorting={sortBy.field === 'paidAt'}
              desc={sortBy.desc}
              onClick={() => setSortBy({ field: 'paidAt' })}
            >
              Date
            </TableHeaderColumn>
            <TableHeaderColumn>Ex Gratia</TableHeaderColumn>
            <TableHeaderColumn>Note</TableHeaderColumn>
            <TableHeaderColumn>Type</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => (
              <TableRow
                key={payment.id}
                onClick={() => {
                  copy(payment.id, {
                    format: 'text/plain',
                  })
                  toast.success('Copied payment ID')
                }}
              >
                <TableColumn>
                  <Monetary amount={payment.amount} />
                </TableColumn>
                <TableColumn>
                  <Monetary amount={payment.deductible} />
                </TableColumn>
                <TableColumn>
                  <FlexVertically>
                    {format(parseISO(payment.paidAt), 'yyyy-MM-dd')}
                    <TableColumnSubtext>
                      {format(parseISO(payment.paidAt), 'HH:mm:ss')}
                    </TableColumnSubtext>
                  </FlexVertically>
                </TableColumn>
                <TableColumn>
                  {payment.exGratia ? (
                    <ExGratiaTag status="success">Yes</ExGratiaTag>
                  ) : (
                    <ExGratiaTag status="danger">No</ExGratiaTag>
                  )}
                </TableColumn>
                <TableColumn>{payment.note}</TableColumn>
                <TableColumn>{payment.type}</TableColumn>
                <TableColumn>
                  <Capitalized>{payment.status}</Capitalized>
                </TableColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollX>
      <PaymentTableFooter>
        <PaymentTotalWrapper>
          <TotalAmount>
            <Label>Total amount</Label>
            <Monetary
              amount={{
                amount: totalAmount.toFixed(2),
                currency: payments[0].amount.currency,
              }}
            />
          </TotalAmount>
          <TotalDeductible>
            <Label>Total deductible</Label>
            <Monetary
              amount={{
                amount: totalDeductible.toFixed(2),
                currency: payments[0].amount.currency,
              }}
            />
          </TotalDeductible>
        </PaymentTotalWrapper>
        {tableHovered ? (
          <FadeIn duration={200}>
            <Tip>Click on a payment row to copy the payment ID</Tip>
          </FadeIn>
        ) : (
          <div>
            <Tip>&nbsp;</Tip>
          </div>
        )}
      </PaymentTableFooter>
    </>
  )
}
