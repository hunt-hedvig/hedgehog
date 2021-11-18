import { useMutation } from '@apollo/client'
import styled from '@emotion/styled'
import {
  Button,
  Card,
  CardsWrapper,
  Flex,
  InfoRow,
  InfoTag,
  InfoText,
  Input,
  LoadingMessage,
  MainHeadline,
  Shadowed,
  Spacing,
  StandaloneMessage,
  Table,
  TableBody,
  TableColumn,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import { formatMoney } from '@hedvig-ui/utils/money'
import copy from 'copy-to-clipboard'
import { format, parseISO } from 'date-fns'
import { Market } from 'features/config/constants'
import { useGetAccount } from 'features/member/tabs/account-tab/hooks/use-get-account'
import gql from 'graphql-tag'
import React, { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  Transaction,
  useCreatePaymentCompletionLinkMutation,
  useGetMemberTransactionsQuery,
  useGetQuotesQuery,
} from 'types/generated/graphql'
import { PayoutDetails } from './PayoutDetails'

const numberRegex = /^\d+$/

const transactionDateSorter = (a, b) => {
  const aDate = new Date(a.timestamp)
  const bDate = new Date(b.timestamp)

  if (aDate > bDate) {
    return 1
  }
  if (bDate > aDate) {
    return -1
  }
  return 0
}

const CHARGE_MEMBER_MUTATION = gql`
  mutation ChargeMember(
    $id: ID!
    $amount: MonetaryAmount!
    $allowManualCharge: Boolean
  ) {
    chargeMember(
      id: $id
      amount: $amount
      allowManualCharge: $allowManualCharge
    ) {
      memberId
      transactions {
        id
        amount {
          amount
          currency
        }
        timestamp
        type
        status
      }
    }
  }
`

const TableRowColored = styled(TableRow)<{
  status: Transaction['status']
  type: Transaction['type']
}>`
  td {
    background-color: ${({ theme, status, type }) => {
      if (type === 'PAYOUT') {
        return theme.accentLighter
      }
      switch (status) {
        case 'INITIATED':
          return theme.lightWarning
        case 'COMPLETED':
          return theme.lightSuccess
        case 'FAILED':
          return theme.lightDanger
      }
    }} !important;
  }
`

const ChargeNotAvailableMessage = styled(StandaloneMessage)`
  font-size: 1.2em;
  padding: 1.5em 0;
`

const MemberTransactionsTable: React.FC<{
  transactions: Transaction[]
}> = ({ transactions }) => (
  <Table>
    <TableHeader>
      <TableHeaderColumn>ID</TableHeaderColumn>
      <TableHeaderColumn>Amount</TableHeaderColumn>
      <TableHeaderColumn>Timestamp</TableHeaderColumn>
      <TableHeaderColumn>Type</TableHeaderColumn>
      <TableHeaderColumn>Status</TableHeaderColumn>
    </TableHeader>
    <TableBody>
      {transactions.map((transaction) => (
        <TableRowColored
          border
          key={transaction.id}
          status={transaction.status!}
          type={transaction.type!}
        >
          <TableColumn>{transaction.id}</TableColumn>
          <TableColumn>
            <strong>{formatMoney(transaction.amount!)}</strong>
          </TableColumn>
          <TableColumn>
            {format(parseISO(transaction.timestamp), 'yyyy-MM-dd HH:mm:ss')}
          </TableColumn>
          <TableColumn>{transaction.type}</TableColumn>
          <TableColumn>{transaction.status}</TableColumn>
        </TableRowColored>
      ))}
    </TableBody>
  </Table>
)

export const PaymentsTab: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const {
    data: memberData,
    loading,
    error,
    refetch,
  } = useGetMemberTransactionsQuery({
    variables: { id: memberId },
  })

  const [manualAmount, setManualAmount] = useState('0')
  console.log('manualAmount', manualAmount)

  const { data: quotesData } = useGetQuotesQuery({
    variables: {
      memberId,
    },
  })

  const [chargeMemberMutation] = useMutation(CHARGE_MEMBER_MUTATION)

  const allowManualCharge = useMemo(
    () =>
      memberData?.member?.contractMarketInfo?.market === Market.Norway &&
      quotesData?.member?.quotes.some(
        (quote) => quote.allowOverrideSignFromHope,
      ),
    [memberData, quotesData],
  )

  const [createPaymentCompletionLink] = useCreatePaymentCompletionLinkMutation({
    variables: { memberId },
  })

  const [account] = useGetAccount(memberId)

  const { confirm } = useConfirmDialog()

  const handleChargeSubmit = () => {
    const chargeAmount = allowManualCharge
      ? {
          ...account?.currentBalance!,
          amount: manualAmount,
        }
      : account?.currentBalance!
    const confirmMessage = `Are you sure you want to charge ${formatMoney(
      chargeAmount,
    )}?`
    confirm(confirmMessage).then(() => {
      toast
        .promise(
          chargeMemberMutation({
            variables: {
              id: memberId,
              amount: chargeAmount,
              allowManualCharge,
            },
          }),
          {
            loading: 'Charging member',
            success: () => {
              setManualAmount('0')
              return 'Member charged'
            },
            error: 'Could not charge member',
          },
        )
        .then(() => refetch())
    })
  }

  if (error) {
    return (
      <StandaloneMessage paddingTop="10vh">
        Something went wrong
      </StandaloneMessage>
    )
  }

  if (loading || !memberData?.member || !account) {
    return <LoadingMessage paddingTop="10vh" />
  }

  return (
    <>
      <MainHeadline>Payments</MainHeadline>
      <CardsWrapper>
        <Card span={2}>
          <InfoRow>
            Direct debit
            <InfoText>
              <InfoTag
                style={{ fontWeight: 'bold', padding: '0.2em 0.7em' }}
                status={
                  memberData?.member?.directDebitStatus?.activated
                    ? 'success'
                    : 'danger'
                }
              >
                {memberData?.member?.directDebitStatus?.activated
                  ? 'Activated'
                  : 'Not Activated'}
              </InfoTag>
            </InfoText>
          </InfoRow>
          <InfoRow>
            Payout method
            <InfoText>
              <InfoTag
                style={{ fontWeight: 'bold', padding: '0.2em 0.7em' }}
                status={
                  memberData?.member?.directDebitStatus?.activated
                    ? 'success'
                    : 'danger'
                }
              >
                {memberData?.member?.directDebitStatus?.activated
                  ? 'Activated'
                  : 'Not Activated'}
              </InfoTag>
            </InfoText>
          </InfoRow>
        </Card>
        <Card span={2}>
          <ThirdLevelHeadline>Payments Link</ThirdLevelHeadline>
          <Button
            onClick={(e) => {
              e.preventDefault()
              toast.promise(createPaymentCompletionLink(), {
                loading: 'Generating payment link...',
                success: ({ data: response }) => {
                  if (!response?.createPaymentCompletionLink?.url) {
                    return null
                  }

                  copy(response?.createPaymentCompletionLink?.url, {
                    format: 'text/plain',
                  })

                  return 'Payment link copied to clipboard'
                },
                error: 'Could not generate payment link',
              })
            }}
          >
            Generate payments link
          </Button>
        </Card>

        {memberData.member?.directDebitStatus?.activated && (
          <Card>
            {allowManualCharge ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleChargeSubmit()
                }}
              >
                <ThirdLevelHeadline>Charge member</ThirdLevelHeadline>
                <Flex align="center" fullWidth={false}>
                  <Input
                    name="manualAmount"
                    placeholder="Amount"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    onFocus={() => manualAmount === '0' && setManualAmount('')}
                    onBlur={() => !manualAmount && setManualAmount('0')}
                    value={manualAmount}
                    title="Only numbers are allowed"
                    onChange={(e) => {
                      if (
                        e.target.value.match(numberRegex) ||
                        !e.target.value
                      ) {
                        setManualAmount(e.currentTarget.value)
                      }
                    }}
                  />
                  <Spacing left="small" width="auto">
                    <Button
                      disabled={!manualAmount || manualAmount === '0'}
                      type="submit"
                    >
                      Charge{' '}
                      {formatMoney({
                        ...account.currentBalance,
                        amount: manualAmount || '0',
                      })}
                    </Button>
                  </Spacing>
                </Flex>
              </form>
            ) : (
              <>
                <ThirdLevelHeadline>Charge current balance</ThirdLevelHeadline>
                {Number(account.currentBalance.amount) > 0.0 ? (
                  <Button onClick={() => handleChargeSubmit()}>
                    Charge {formatMoney(account.currentBalance!)}
                  </Button>
                ) : (
                  <ChargeNotAvailableMessage opacity={0.6}>
                    Not available since the balance is{' '}
                    <Shadowed style={{ fontWeight: 'bold' }}>
                      {formatMoney(account.currentBalance!)}
                    </Shadowed>
                  </ChargeNotAvailableMessage>
                )}
              </>
            )}
          </Card>
        )}
        {memberData.member.payoutMethodStatus?.activated &&
          memberData.member.contractMarketInfo?.market === Market.Sweden && (
            <Card>
              <ThirdLevelHeadline>Payout</ThirdLevelHeadline>
              <PayoutDetails memberId={memberId} />
            </Card>
          )}
        <Card>
          <ThirdLevelHeadline>Transactions</ThirdLevelHeadline>
          <MemberTransactionsTable
            transactions={
              memberData.member
                .transactions!.slice()
                .sort(transactionDateSorter)
                .reverse() as Transaction[]
            }
          />
        </Card>
      </CardsWrapper>
    </>
  )
}
