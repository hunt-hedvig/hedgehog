import styled from '@emotion/styled'
import { format, parseISO } from 'date-fns'
import { useClaimPaymentsQuery } from 'types/generated/graphql'

import {
  Capitalized,
  CardContent,
  CardTitle,
  FadeIn,
  InfoRow,
  InfoTag,
  InfoText,
  Label,
  Monetary,
  Paragraph,
  Spacing,
  StandaloneMessage,
  Table,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { ArrayElement } from '@hedvig-ui/utils/array-element'
import copy from 'copy-to-clipboard'
import React, { useState } from 'react'
import { BugFill } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import { Market } from 'types/enums'
import { ClaimPayment } from './ClaimPayment'

const ScrollX = styled.div`
  margin-bottom: 1em;
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
`

const MemberIdentityCard = styled.div`
  width: 100%;
  padding: 2rem;
  border-radius: 7px;
  border: none;
  background-color: rgba(0, 0, 0, 0.05);
  margin-right: 2em;
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

export const ClaimPayments: React.FC<{
  claimId: string
  focus: boolean
}> = ({ focus, claimId }) => {
  const [tableHovered, setTableHovered] = useState(false)

  const {
    data: paymentsData,
    error: queryError,
    loading: loadingPayments,
  } = useClaimPaymentsQuery({
    variables: { claimId },
  })

  const payments = [...(paymentsData?.claim?.payments ?? [])]

  const [filter, setFilter] = useState<{
    field: 'timestamp' | 'deductible' | 'amount'
    desc: boolean
  }>({ field: 'timestamp', desc: true })

  const sortHandler = (
    p1: ArrayElement<typeof payments>,
    p2: ArrayElement<typeof payments>,
  ) => {
    const direction = filter.desc ? 1 : -1

    return (p1[filter.field] < p2[filter.field] ? 1 : -1) * direction
  }

  const identity = paymentsData?.claim?.member?.identity

  const totalAmount = payments
    .map((payment) => +payment?.amount?.amount)
    .reduce((acc, amount) => acc + amount, 0)
  const totalDeductible = payments
    .map((payment) => +payment?.deductible?.amount)
    .reduce((acc, amount) => acc + amount, 0)

  const setFilterHandler = (field) => {
    setFilter((prev) => ({
      field,
      desc: prev.field === field ? !prev.desc : true,
    }))
  }

  return (
    <CardContent>
      <CardTitle
        title="Payments"
        badge={
          queryError
            ? {
                icon: BugFill,
                status: 'danger',
                label: 'Internal Error',
              }
            : null
        }
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {paymentsData?.claim?.contract?.market === Market.Norway && (
          <MemberIdentityCard>
            <ThirdLevelHeadline>Member Identity</ThirdLevelHeadline>
            <InfoRow>
              Identified
              <InfoText>
                <InfoTag
                  style={{ fontWeight: 'bold' }}
                  status={identity ? 'success' : 'warning'}
                >
                  {identity ? 'Yes' : 'No'}
                </InfoTag>
              </InfoText>
            </InfoRow>
            {identity && (
              <>
                <InfoRow>
                  Personal Number
                  <InfoText>
                    {identity.nationalIdentification.identification}
                  </InfoText>
                </InfoRow>
                {identity.firstName && identity.lastName && (
                  <InfoRow>
                    Name
                    <InfoText>
                      {identity.firstName} {identity.lastName}
                    </InfoText>
                  </InfoRow>
                )}
              </>
            )}
          </MemberIdentityCard>
        )}
      </div>

      {payments.length ? (
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
                  sorting={filter.field === 'amount'}
                  desc={filter.desc}
                  onClick={() => setFilterHandler('amount')}
                >
                  Amount
                </TableHeaderColumn>
                <TableHeaderColumn
                  withSort
                  sorting={filter.field === 'deductible'}
                  desc={filter.desc}
                  onClick={() => setFilterHandler('deductible')}
                >
                  Deductible
                </TableHeaderColumn>
                <TableHeaderColumn
                  withSort
                  sorting={filter.field === 'timestamp'}
                  desc={filter.desc}
                  onClick={() => setFilterHandler('timestamp')}
                >
                  Date
                </TableHeaderColumn>
                <TableHeaderColumn>Ex Gratia</TableHeaderColumn>
                <TableHeaderColumn>Note</TableHeaderColumn>
                <TableHeaderColumn>Type</TableHeaderColumn>
                <TableHeaderColumn>Status</TableHeaderColumn>
              </TableHeader>
              {payments.sort(sortHandler).map((payment) => (
                <TableRow
                  key={payment.id}
                  onClick={() => {
                    copy(payment.id!, {
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
                      {format(parseISO(payment.timestamp), 'yyyy-MM-dd')}
                      <TableColumnSubtext>
                        {format(parseISO(payment.timestamp), 'HH:mm:ss')}
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
            </Table>
          </ScrollX>
          <PaymentTableFooter>
            <PaymentTotalWrapper>
              <TotalAmount>
                <Label>Total amount</Label>
                <Monetary
                  amount={{
                    amount: totalAmount.toFixed(2),
                    currency: payments[0]!.amount.currency,
                  }}
                />
              </TotalAmount>
              <TotalDeductible>
                <Label>Total deductible</Label>
                <Monetary
                  amount={{
                    amount: totalDeductible.toFixed(2),
                    currency: payments[0]!.amount.currency,
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
      ) : (
        <NoPaymentsMessage>No payments have been made</NoPaymentsMessage>
      )}

      <Spacing top="medium" />
      {!loadingPayments &&
        paymentsData?.claim?.contract &&
        paymentsData?.claim?.agreement?.carrier && (
          <ClaimPayment
            focus={focus}
            sanctionStatus={paymentsData?.claim?.member.sanctionStatus}
            claimId={claimId}
            identified={Boolean(identity)}
            market={paymentsData?.claim?.contract?.market}
            carrier={paymentsData?.claim?.agreement?.carrier}
          />
        )}
    </CardContent>
  )
}
