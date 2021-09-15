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
  Shadowed,
  Spacing,
  StandaloneMessage,
  Table,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import copy from 'copy-to-clipboard'
import React, { useState } from 'react'
import { BugFill } from 'react-bootstrap-icons'
import { toast } from 'react-hot-toast'
import { Market } from 'types/enums'
import { ClaimReserves } from '../ClaimReserves'
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

const NoCarrierMessage = styled(StandaloneMessage)`
  padding: 3em 0;
  text-align: center;
`

const NoCarrierSubtitle = styled(Paragraph)`
  font-size: 0.8em;
  padding-top: 1em;
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

export const ClaimPayments: React.FC<{ claimId: string; carrier?: string }> = ({
  claimId,
  carrier,
}) => {
  const [tableHovered, setTableHovered] = useState(false)

  const {
    data: paymentsData,
    refetch: refetchPayments,
    error: queryError,
    loading: loadingPayments,
  } = useClaimPaymentsQuery({
    variables: { claimId },
  })

  const payments = [...(paymentsData?.claim?.payments ?? [])].sort(
    (a, b) => b.timestamp - a.timestamp,
  )
  const identity = paymentsData?.claim?.member?.identity

  const totalAmount = payments
    .map((payment) => +payment?.amount?.amount)
    .reduce((acc, amount) => acc + amount, 0)
  const totalDeductible = payments
    .map((payment) => +payment?.deductible?.amount)
    .reduce((acc, amount) => acc + amount, 0)

  if (!carrier) {
    return (
      <CardContent>
        <CardTitle title="Payments" />
        <NoCarrierMessage opacity={0.6}>
          Cannot make a payment or set a reserve without a carrier.
          <NoCarrierSubtitle>
            Select a <Shadowed>Contract</Shadowed> and{' '}
            <Shadowed>Date of Occurrence</Shadowed> such that the claim is
            covered on the date.
          </NoCarrierSubtitle>
        </NoCarrierMessage>
      </CardContent>
    )
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
        <ClaimReserves
          claimId={claimId}
          reserves={paymentsData?.claim?.reserves}
          refetch={refetchPayments}
          loading={loadingPayments}
        />
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
                <TableHeaderColumn>Amount</TableHeaderColumn>
                <TableHeaderColumn>Deductible</TableHeaderColumn>
                <TableHeaderColumn>Date</TableHeaderColumn>
                <TableHeaderColumn>Ex Gratia</TableHeaderColumn>
                <TableHeaderColumn>Note</TableHeaderColumn>
                <TableHeaderColumn>Type</TableHeaderColumn>
                <TableHeaderColumn>Status</TableHeaderColumn>
              </TableHeader>
              {payments.map((payment) => (
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
