import styled from '@emotion/styled'
import {
  Table as MuiTable,
  TableBody as MuiTableBody,
  TableCell as MuiTableCell,
  TableHead as MuiTableHead,
  TableRow as MuiTableRow,
  withStyles,
} from '@material-ui/core'
import { useClaimPaymentsQuery } from 'api/generated/graphql'
import { format, parseISO } from 'date-fns'

import {
  CardContent,
  InfoRow,
  InfoTag,
  InfoText,
  Paragraph,
  Shadowed,
  Spinner,
  StandaloneMessage,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { PaperTitle } from 'components/claims/claim-details/components/claim-items/PaperTitle'
import React from 'react'
import { BugFill } from 'react-bootstrap-icons'
import { Market } from 'types/enums'
import { Checkmark, Cross } from '../../../icons'
import { ClaimPayment } from './ClaimPayment'
import { ClaimReserves } from './ClaimReserves'

const ScrollX = styled.div`
  overflow-x: scroll;
  -webkit-overflow-scrolling: touch;
`
const PaymentTable = withStyles({
  root: {
    marginTop: '1rem',
  },
})(MuiTable)

const PaymentTableCell = withStyles({
  root: {
    fontSize: '1rem',
  },
})(MuiTableCell)

const TotalCell = styled(MuiTableCell)`
  font-size: 1.1rem;
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

export const ClaimPayments: React.FC<{ claimId: string; carrier?: string }> = ({
  claimId,
  carrier,
}) => {
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
        <PaperTitle title={'Payments'} />
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
      <PaperTitle
        title={'Payments'}
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
        <ScrollX>
          {loadingPayments && <Spinner />}
          <PaymentTable>
            <MuiTableHead>
              <MuiTableRow>
                <PaymentTableCell>Id</PaymentTableCell>
                <PaymentTableCell>Amount</PaymentTableCell>
                <PaymentTableCell>Deductible</PaymentTableCell>
                <PaymentTableCell>Note</PaymentTableCell>
                <PaymentTableCell>Date</PaymentTableCell>
                <PaymentTableCell>Ex Gratia</PaymentTableCell>
                <PaymentTableCell>Type</PaymentTableCell>
                <PaymentTableCell>Status</PaymentTableCell>
              </MuiTableRow>
            </MuiTableHead>
            <MuiTableBody>
              {payments.map((payment) => (
                <MuiTableRow key={payment.id}>
                  <PaymentTableCell>{payment.id}</PaymentTableCell>
                  <PaymentTableCell>
                    {payment.amount.amount}&nbsp;{payment.amount.currency}
                  </PaymentTableCell>
                  <PaymentTableCell>
                    {payment.deductible.amount}&nbsp;
                    {payment.deductible.currency}
                  </PaymentTableCell>
                  <PaymentTableCell>{payment.note}</PaymentTableCell>
                  <PaymentTableCell>
                    {format(parseISO(payment.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                  </PaymentTableCell>
                  <PaymentTableCell>
                    {payment.exGratia ? <Checkmark /> : <Cross />}
                  </PaymentTableCell>
                  <PaymentTableCell>{payment.type}</PaymentTableCell>
                  <PaymentTableCell>{payment.status}</PaymentTableCell>
                </MuiTableRow>
              ))}
              {totalAmount > 0 && (
                <>
                  <MuiTableRow>
                    <TotalCell>
                      <b>Amount Total: </b>
                    </TotalCell>
                    <TotalCell align="right">
                      {totalAmount.toFixed(2)}&nbsp;
                      {payments[0]!.amount.currency}
                    </TotalCell>
                  </MuiTableRow>
                  <MuiTableRow>
                    <TotalCell>
                      <b>Deductible Total: </b>
                    </TotalCell>
                    <TotalCell align="right">
                      {totalDeductible.toFixed(2)}&nbsp;
                      {payments[0]!.deductible.currency}
                    </TotalCell>
                  </MuiTableRow>
                </>
              )}
            </MuiTableBody>
          </PaymentTable>
        </ScrollX>
      ) : (
        <NoPaymentsMessage>No payments have been made</NoPaymentsMessage>
      )}

      {!loadingPayments &&
        paymentsData?.claim?.contract &&
        paymentsData?.claim?.agreement?.carrier && (
          <ClaimPayment
            sanctionStatus={paymentsData?.claim?.member.sanctionStatus}
            claimId={claimId}
            refetch={refetchPayments}
            identified={Boolean(identity)}
            market={paymentsData?.claim?.contract?.market}
            carrier={paymentsData?.claim?.agreement?.carrier}
          />
        )}
    </CardContent>
  )
}
