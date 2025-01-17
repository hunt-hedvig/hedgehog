import { useMutation } from '@apollo/client'
import styled from '@emotion/styled'
import {
  Button,
  Card,
  CardsWrapper,
  Copyable,
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
import { useConfirmDialog } from '@hedvig-ui'
import { formatMoney } from '@hedvig-ui'
import copy from 'copy-to-clipboard'
import { format, parseISO } from 'date-fns'
import { Market } from 'portals/hope/features/config/constants'
import { useGetAccount } from 'portals/hope/features/member/tabs/account-tab/hooks/use-get-account'
import gql from 'graphql-tag'
import React, { useMemo, useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  Transaction,
  useCreatePaymentCompletionLinkMutation,
  useGetMemberTransactionsQuery,
  useMemberQuotesQuery,
} from 'types/generated/graphql'
import { PayoutDetails } from './PayoutDetails'

const numberRegex = /^\d+$/

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

const PaymentTable = styled(Table)`
  flex: 1;
  display: flex;
  flex-direction: column;
`

const PaymentTableHeader = styled(TableHeader)`
  & tr {
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 0.4fr 0.6fr 0.3fr 0.5fr;
  }
`

const PaymentColumn = styled(TableColumn)`
  &,
  & * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

const TableRowColored = styled(TableRow)<{
  status: Transaction['status']
  type: Transaction['type']
}>`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr 0.4fr 0.6fr 0.3fr 0.5fr;

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

const MemberTransactionsTable: React.FC<{ memberId: string }> = ({
  memberId,
}) => {
  const { data } = useGetMemberTransactionsQuery({
    variables: { id: memberId },
  })

  const transactions = (data?.member?.transactions ?? [])
    .slice()
    .sort((a, b) =>
      a && b
        ? new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        : 0,
    )
    .reverse()

  return (
    <PaymentTable>
      <PaymentTableHeader>
        <TableHeaderColumn>ID</TableHeaderColumn>
        <TableHeaderColumn>Amount</TableHeaderColumn>
        <TableHeaderColumn>Timestamp</TableHeaderColumn>
        <TableHeaderColumn>Type</TableHeaderColumn>
        <TableHeaderColumn>Status</TableHeaderColumn>
      </PaymentTableHeader>
      <TableBody>
        {transactions.map((transaction) => {
          if (!transaction) {
            return null
          }

          return (
            <TableRowColored
              border
              key={transaction.id}
              status={transaction.status}
              type={transaction.type}
            >
              <PaymentColumn title={transaction.id?.toString()}>
                {transaction.id}
              </PaymentColumn>
              <PaymentColumn
                title={
                  transaction.amount ? formatMoney(transaction.amount) : ''
                }
              >
                <strong>
                  {transaction.amount ? formatMoney(transaction.amount) : ''}
                </strong>
              </PaymentColumn>
              <PaymentColumn
                title={format(
                  parseISO(transaction.timestamp),
                  'yyyy-MM-dd HH:mm:ss',
                )}
              >
                {format(parseISO(transaction.timestamp), 'yyyy-MM-dd HH:mm:ss')}
              </PaymentColumn>
              <PaymentColumn title={transaction.type?.toString()}>
                {transaction.type}
              </PaymentColumn>
              <PaymentColumn title={transaction.status?.toString()}>
                {transaction.status}
              </PaymentColumn>
            </TableRowColored>
          )
        })}
      </TableBody>
    </PaymentTable>
  )
}

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
    fetchPolicy: 'no-cache',
  })

  const [manualAmount, setManualAmount] = useState('0')

  const { data: quotesData } = useMemberQuotesQuery({
    variables: {
      memberId,
    },
    fetchPolicy: 'no-cache',
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
    if (!account?.currentBalance) {
      return
    }

    const chargeAmount = allowManualCharge
      ? {
          ...account.currentBalance,
          amount: manualAmount,
        }
      : account.currentBalance

    confirm(
      `Are you sure you want to charge ${formatMoney(chargeAmount)}?`,
    ).then(() => {
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
        <Card span={1.5}>
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
          {memberData.member?.adyenShopperReference && (
            <InfoRow>
              Adyen shopper reference
              <InfoText>
                <Copyable
                  onClick={() =>
                    memberData?.member?.adyenShopperReference &&
                    copy(memberData.member.adyenShopperReference)
                  }
                >
                  {memberData.member.adyenShopperReference}
                </Copyable>
              </InfoText>
            </InfoRow>
          )}
        </Card>
        <Card span={3}>
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
                    Charge {formatMoney(account.currentBalance)}
                  </Button>
                ) : (
                  <ChargeNotAvailableMessage opacity={0.6}>
                    Not available since the balance is{' '}
                    <Shadowed style={{ fontWeight: 'bold' }}>
                      {formatMoney(account.currentBalance)}
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
          <MemberTransactionsTable memberId={memberId} />
        </Card>
      </CardsWrapper>
    </>
  )
}
