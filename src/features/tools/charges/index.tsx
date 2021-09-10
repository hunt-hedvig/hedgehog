import { Mutation } from '@apollo/client/react/components'
import styled from '@emotion/styled'
import { FadeIn, LoadingMessage, MainHeadline } from '@hedvig-ui'
import { colors } from '@hedviginsurance/brand'
import { format } from 'date-fns'
import gql from 'graphql-tag'
import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import {
  PaymentScheduleQueryDocument,
  usePaymentScheduleQueryQuery,
} from 'types/generated/graphql'
import { MonetaryAmount } from 'utils/helpers'
import { formatMoney } from 'utils/money'

const approveMemberCharge = gql`
  mutation approveMemberCharge($approvals: [MemberChargeApproval!]!) {
    approveMemberCharge(approvals: $approvals)
  }
`

const TableRow = styled(Table.Row)((props: { warning: boolean }) => ({
  backgroundColor: props.warning ? 'yellow' : undefined,
}))

const ButtonWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
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
      amount: MonetaryAmount
    }
    account?: {
      currentBalance: MonetaryAmount
    }
  }
  status: string
  amount: MonetaryAmount
}

const Row: React.FC<{
  paymentSchedule: PaymentSchedule[]
}> = ({ paymentSchedule }) => (
  <>
    {paymentSchedule.map((payment) => (
      <TableRow
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
        <Table.Cell>
          {payment.member?.firstName + ' ' + payment.member?.lastName}
        </Table.Cell>
        <Table.Cell>
          <Link to={`/members/${payment.member?.memberId}`}>
            {payment.member?.memberId}
          </Link>
        </Table.Cell>
        <Table.Cell>
          {payment.member?.monthlySubscription?.amount
            ? formatMoney(payment.member.monthlySubscription.amount)
            : 'Unable to get monthly premium'}
        </Table.Cell>
        <Table.Cell>
          {payment.member?.account?.currentBalance
            ? formatMoney(payment.member.account.currentBalance)
            : '⚠️ No current balance'}
          {payment.member?.account?.currentBalance &&
            parseFloat(payment.member.account.currentBalance.amount) <= 0 &&
            " (Won't be charged)"}
        </Table.Cell>
      </TableRow>
    ))}
  </>
)

export const ChargePage: React.FC = () => {
  const [confirming, setConfirming] = useState(false)
  const { data, loading, error } = usePaymentScheduleQueryQuery({
    variables: {
      month: format(new Date(), 'yyyy-MM'),
    },
  })
  if (error) {
    return (
      <Table.Row>
        Error in GraphQl query: <pre>{JSON.stringify(error, null, 2)}</pre>
      </Table.Row>
    )
  }
  if (loading || !data?.paymentSchedule) {
    return <LoadingMessage paddingTop="10vh" />
  }
  return (
    <FadeIn>
      <MainHeadline>💰 Approve charges</MainHeadline>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Member Name</Table.HeaderCell>
            <Table.HeaderCell>Member Id</Table.HeaderCell>
            <Table.HeaderCell>Member Premium</Table.HeaderCell>
            <Table.HeaderCell>Charge Amount</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Row
            paymentSchedule={data.paymentSchedule!.map((schedule) => {
              if (!schedule) {
                throw Error('Schedule not present when it should')
              }
              return {
                id: schedule!.id!,
                member: {
                  memberId: schedule.member?.memberId!,
                  firstName: schedule.member?.firstName!,
                  lastName: schedule.member?.lastName!,
                  monthlySubscription: {
                    amount: schedule.member?.monthlySubscription
                      ?.amount! as MonetaryAmount,
                  },
                  account: {
                    currentBalance: schedule.member?.account!
                      ?.currentBalance! as MonetaryAmount,
                  },
                },
                status: schedule.status,
                amount: schedule.amount! as MonetaryAmount,
              }
            })}
          />
        </Table.Body>
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
                              approvals: data.paymentSchedule!.map(
                                (payment) => ({
                                  memberId: payment!.member!.memberId,
                                  amount: payment!.member!.account!
                                    .currentBalance,
                                }),
                              ),
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
