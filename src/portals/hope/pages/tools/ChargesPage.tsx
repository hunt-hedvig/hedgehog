import { Mutation } from '@apollo/client/react/components'
import styled from '@emotion/styled'
import {
  FadeIn,
  LoadingMessage,
  MainHeadline,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
} from '@hedvig-ui'
import { useTitle } from '@hedvig-ui/hooks/use-title'
import { formatMoney } from '@hedvig-ui/utils/money'
import { colors } from '@hedviginsurance/brand'
import { format } from 'date-fns'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import {
  MonetaryAmountV2,
  PaymentScheduleQueryDocument,
  usePaymentScheduleQueryQuery,
} from 'types/generated/graphql'
import { Page } from 'portals/hope/pages/routes'

const approveMemberCharge = gql`
  mutation approveMemberCharge($approvals: [MemberChargeApproval!]!) {
    approveMemberCharge(approvals: $approvals)
  }
`

const TableRowStyled = styled(TableRow)<{ warning: boolean }>`
  background-color: ${({ warning }) => warning && 'yellow'};
`

const ButtonWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
  marginTop: '1em',
})

const Button = styled('button')({
  padding: '10px 15px',
  background: colors.GREEN,
  color: colors.WHITE,
  fontWeight: 600,
  border: 0,
  borderRadius: 5,
  fontSize: '1.2rem',
  transition: 'background 250ms',

  '&:hover, &:focus': {
    background: '#18cea1',
    cursor: 'pointer',
  },
})

const ConfirmMessage = styled('div')({
  padding: '12px',
  alignItems: 'center',
  color: colors.OFF_BLACK_DARK,
  fontSize: '1.2rem',
})

interface PaymentSchedule {
  id: string
  member: {
    memberId?: string
    firstName?: string
    lastName?: string
    monthlySubscription?: {
      amount: MonetaryAmountV2
    }
    account?: {
      currentBalance: MonetaryAmountV2
    }
  }
  status: string
  amount: MonetaryAmountV2
}

const Row: React.FC<{
  paymentSchedule: PaymentSchedule[]
}> = ({ paymentSchedule }) => (
  <>
    {paymentSchedule.map((payment) => (
      <TableRowStyled
        border
        key={payment.id}
        warning={Boolean(
          payment.member?.account &&
            payment.member?.monthlySubscription &&
            payment.member?.account.currentBalance &&
            payment.member.monthlySubscription.amount &&
            payment.member.account.currentBalance.amount !==
              payment.member.monthlySubscription.amount.amount,
        )}
      >
        <TableColumn>
          {payment.member?.firstName + ' ' + payment.member?.lastName}
        </TableColumn>
        <TableColumn>
          <Link to={`/members/${payment.member?.memberId}`}>
            {payment.member?.memberId}
          </Link>
        </TableColumn>
        <TableColumn>
          {payment.member?.monthlySubscription?.amount
            ? formatMoney(payment.member.monthlySubscription.amount)
            : 'Unable to get monthly premium'}
        </TableColumn>
        <TableColumn>
          {payment.member?.account?.currentBalance
            ? formatMoney(payment.member.account.currentBalance)
            : '⚠️ No current balance'}
          {payment.member?.account?.currentBalance &&
            parseFloat(payment.member.account.currentBalance.amount) <= 0 &&
            " (Won't be charged)"}
        </TableColumn>
      </TableRowStyled>
    ))}
  </>
)

const ChargesPage: Page = () => {
  const [confirming, setConfirming] = useState(false)
  const { data, loading, error } = usePaymentScheduleQueryQuery({
    variables: {
      month: format(new Date(), 'yyyy-MM'),
    },
  })

  useTitle('Tools | Approve Charges')

  if (error) {
    return (
      <TableRow>
        Error in GraphQl query: <pre>{JSON.stringify(error, null, 2)}</pre>
      </TableRow>
    )
  }
  if (loading || !data?.paymentSchedule) {
    return <LoadingMessage paddingTop="10vh" />
  }
  return (
    <FadeIn>
      <MainHeadline>💰 Approve charges</MainHeadline>
      <Table>
        <TableHeader>
          <TableHeaderColumn>Member Name</TableHeaderColumn>
          <TableHeaderColumn>Member Id</TableHeaderColumn>
          <TableHeaderColumn>Member Premium</TableHeaderColumn>
          <TableHeaderColumn>Charge Amount</TableHeaderColumn>
        </TableHeader>
        <TableBody>
          <Row
            paymentSchedule={data.paymentSchedule.map((schedule) => {
              if (!schedule) {
                throw Error('Schedule not present when it should')
              }

              return {
                id: schedule.id,
                member: {
                  memberId: schedule?.member?.memberId,
                  firstName: schedule?.member?.firstName as string | undefined,
                  lastName: schedule?.member?.lastName as string | undefined,
                  monthlySubscription: schedule?.member?.monthlySubscription
                    ?.amount && {
                    amount: schedule.member.monthlySubscription
                      .amount as MonetaryAmountV2,
                  },
                  account: schedule.member?.account?.currentBalance && {
                    currentBalance: schedule.member?.account
                      ?.currentBalance as MonetaryAmountV2,
                  },
                },
                status: schedule.status,
                amount: schedule.amount as MonetaryAmountV2,
              }
            })}
          />
        </TableBody>
      </Table>
      <ButtonWrapper>
        <Mutation
          mutation={approveMemberCharge}
          refetchQueries={() => [
            {
              query: PaymentScheduleQueryDocument,
              variables: { month: format(new Date(), 'yyyy-MM') },
            },
          ]}
        >
          {(mutation, mutationProps) => {
            return (
              <Button
                disabled={mutationProps.loading}
                onClick={
                  confirming
                    ? () => {
                        if (mutationProps.loading) {
                          return
                        }

                        toast.promise(
                          mutation({
                            variables: {
                              approvals:
                                data.paymentSchedule?.map((payment) => ({
                                  memberId: payment?.member?.memberId ?? '',
                                  amount:
                                    payment?.member?.account?.currentBalance,
                                })) ?? [],
                            },
                          }),
                          {
                            loading: 'Approving',
                            success: 'Charges sent for approval',
                            error: 'An error occurred',
                          },
                        )
                      }
                    : () => setConfirming(true)
                }
              >
                {confirming ? "Yes, I'm sure" : 'Do it'}
              </Button>
            )
          }}
        </Mutation>
        {confirming ? <ConfirmMessage>Are you sure?</ConfirmMessage> : null}
      </ButtonWrapper>
    </FadeIn>
  )
}

export default ChargesPage
