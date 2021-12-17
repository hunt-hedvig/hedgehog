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
import { useArrowKeyboardNavigation } from '@hedvig-ui/hooks/keyboard/use-arrow-keyboard-navigation'
import { useConfirmDialog } from '@hedvig-ui/Modal/use-confirm-dialog'
import { formatMoney } from '@hedvig-ui/utils/money'
import copy from 'copy-to-clipboard'
import { format, parseISO } from 'date-fns'
import { Market } from 'features/config/constants'
import { useGetAccount } from 'features/member/tabs/account-tab/hooks/use-get-account'
import {
  FocusItems,
  useFocus,
  useNavigation,
} from 'features/navigation/hooks/use-navigation'
import gql from 'graphql-tag'
import React, { useMemo, useRef, useState } from 'react'
import { toast } from 'react-hot-toast'
import {
  Transaction,
  useCreatePaymentCompletionLinkMutation,
  useGetMemberTransactionsQuery,
  useGetQuotesQuery,
} from 'types/generated/graphql'
import { PayoutDetails } from './PayoutDetails'

const PaymentCard = styled(Card)<{ focused: boolean }>`
  border-radius: 0.5rem;
  border: ${({ focused, theme }) =>
    focused ? `1px solid ${theme.accent}` : 'none'};
`

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

const MemberTransactionsTable: React.FC<{
  transactions: Transaction[]
}> = ({ transactions }) => (
  <PaymentTable>
    <PaymentTableHeader>
      <TableHeaderColumn>ID</TableHeaderColumn>
      <TableHeaderColumn>Amount</TableHeaderColumn>
      <TableHeaderColumn>Timestamp</TableHeaderColumn>
      <TableHeaderColumn>Type</TableHeaderColumn>
      <TableHeaderColumn>Status</TableHeaderColumn>
    </PaymentTableHeader>
    <TableBody>
      {transactions.map((transaction) => (
        <TableRowColored
          border
          key={transaction.id}
          status={transaction.status!}
          type={transaction.type!}
        >
          <PaymentColumn title={transaction.id?.toString()}>
            {transaction.id}
          </PaymentColumn>
          <PaymentColumn title={formatMoney(transaction.amount!)}>
            <strong>{formatMoney(transaction.amount!)}</strong>
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
      ))}
    </TableBody>
  </PaymentTable>
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
  const cardsRef = useRef<HTMLDivElement>(null)

  const { focus, setFocus } = useNavigation()
  useFocus(FocusItems.Member.items.Payments)

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

  const generateLinkHandler = () => {
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
  }

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

  const [navigationStep] = useArrowKeyboardNavigation({
    maxStep: 3,
    onPerformNavigation: (index) => {
      if (index === 0) {
        generateLinkHandler()
      }

      if (index === 1) {
        handleChargeSubmit()
      }

      if (index === 2) {
        setFocus(FocusItems.Member.items.PaymentsForm)
      }
    },
    direction: 'horizontal',
    isActive: focus === FocusItems.Member.items.Payments,
    withNegative: true,
  })

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
      <CardsWrapper ref={cardsRef}>
        <PaymentCard
          span={2}
          focus={navigationStep + 1 === 0}
          focused={navigationStep + 1 === 0}
        >
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
        </PaymentCard>
        <PaymentCard
          span={2}
          focus={navigationStep + 1 === 1}
          focused={navigationStep + 1 === 1}
        >
          <ThirdLevelHeadline>Payments Link</ThirdLevelHeadline>
          <Button
            onClick={(e) => {
              e.preventDefault()
              generateLinkHandler()
            }}
          >
            Generate payments link
          </Button>
        </PaymentCard>

        {memberData.member?.directDebitStatus?.activated && (
          <PaymentCard
            focus={navigationStep + 1 === 2}
            focused={navigationStep + 1 === 2}
          >
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
          </PaymentCard>
        )}
        {memberData.member.payoutMethodStatus?.activated &&
          memberData.member.contractMarketInfo?.market === Market.Sweden && (
            <PaymentCard
              focus={navigationStep + 1 === 3}
              focused={navigationStep + 1 === 3}
            >
              <ThirdLevelHeadline>Payout</ThirdLevelHeadline>
              <PayoutDetails
                memberId={memberId}
                navigationAvailable={
                  navigationStep + 1 === 3 &&
                  focus === FocusItems.Member.items.PaymentsForm
                }
              />
            </PaymentCard>
          )}
        <PaymentCard
          focus={navigationStep + 1 === 4}
          focused={navigationStep + 1 === 4}
        >
          <ThirdLevelHeadline>Transactions</ThirdLevelHeadline>
          <MemberTransactionsTable
            transactions={
              memberData.member
                .transactions!.slice()
                .sort(transactionDateSorter)
                .reverse() as Transaction[]
            }
          />
        </PaymentCard>
      </CardsWrapper>
    </>
  )
}
