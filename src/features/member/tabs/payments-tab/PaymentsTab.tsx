import { Mutation } from '@apollo/client/react/components'
import styled from '@emotion/styled'
import {
  Button,
  Card,
  CardsWrapper,
  InfoRow,
  InfoTag,
  InfoText,
  LoadingMessage,
  MainHeadline,
  Shadowed,
  StandaloneMessage,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import copy from 'copy-to-clipboard'
import { format, parseISO } from 'date-fns'
import gql from 'graphql-tag'
import { useGetAccount } from 'graphql/use-get-account'
import React from 'react'
import { toast } from 'react-hot-toast'
import { Table } from 'semantic-ui-react'
import { Market } from 'types/enums'
import {
  Transaction,
  useCreatePaymentCompletionLinkMutation,
  useGetMemberTransactionsQuery,
} from 'types/generated/graphql'
import { useConfirmDialog } from 'utils/hooks/modal-hook'
import { formatMoney } from 'utils/money'
import { PayoutDetails } from './PayoutDetails'

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
  mutation ChargeMember($id: ID!, $amount: MonetaryAmount!) {
    chargeMember(id: $id, amount: $amount) {
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

const TableRowColored = styled(Table.Row)<{
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
  <Table celled compact>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>ID</Table.HeaderCell>
        <Table.HeaderCell>Amount</Table.HeaderCell>
        <Table.HeaderCell>Timestamp</Table.HeaderCell>
        <Table.HeaderCell>Type</Table.HeaderCell>
        <Table.HeaderCell>Status</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {transactions.map((transaction) => (
        <TableRowColored
          key={transaction.id}
          status={transaction.status!}
          type={transaction.type!}
        >
          <Table.Cell>{transaction.id}</Table.Cell>
          <Table.Cell>
            <strong>{formatMoney(transaction.amount!)}</strong>
          </Table.Cell>
          <Table.Cell>
            {format(parseISO(transaction.timestamp), 'yyyy-MM-dd HH:mm:ss')}
          </Table.Cell>
          <Table.Cell>{transaction.type}</Table.Cell>
          <Table.Cell>{transaction.status}</Table.Cell>
        </TableRowColored>
      ))}
    </Table.Body>
  </Table>
)

export const PaymentsTab: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const { data, loading, error, refetch } = useGetMemberTransactionsQuery({
    variables: { id: memberId },
  })

  const [createPaymentCompletionLink] = useCreatePaymentCompletionLinkMutation({
    variables: { memberId },
  })

  const [account] = useGetAccount(memberId)

  const { confirm } = useConfirmDialog()

  const handleChargeSubmit = (mutation) => {
    const confirmMessage = `Are you sure you want to charge ${formatMoney(
      account?.currentBalance!,
    )}?`
    confirm(confirmMessage).then(() => {
      toast
        .promise(
          mutation({
            variables: {
              id: memberId,
              amount: account?.currentBalance,
            },
          }),
          {
            loading: 'Charging member',
            success: 'Member charged',
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

  if (loading || !data?.member || !account) {
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
                  data?.member?.directDebitStatus?.activated
                    ? 'success'
                    : 'danger'
                }
              >
                {data?.member?.directDebitStatus?.activated
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
                  data?.member?.directDebitStatus?.activated
                    ? 'success'
                    : 'danger'
                }
              >
                {data?.member?.directDebitStatus?.activated
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

        {data.member?.directDebitStatus?.activated && (
          <Card>
            <ThirdLevelHeadline>Charge current balance</ThirdLevelHeadline>
            {Number(account.currentBalance.amount) > 0.0 ? (
              <Mutation mutation={CHARGE_MEMBER_MUTATION}>
                {(chargeMember) => (
                  <>
                    <Button onClick={() => handleChargeSubmit(chargeMember)}>
                      Charge {formatMoney(account.currentBalance!)}
                    </Button>
                  </>
                )}
              </Mutation>
            ) : (
              <ChargeNotAvailableMessage opacity={0.6}>
                Not available since the balance is{' '}
                <Shadowed style={{ fontWeight: 'bold' }}>
                  {formatMoney(account.currentBalance!)}
                </Shadowed>
              </ChargeNotAvailableMessage>
            )}
          </Card>
        )}
        {data.member.payoutMethodStatus?.activated &&
          data.member.contractMarketInfo?.market === Market.Sweden && (
            <Card>
              <ThirdLevelHeadline>Payout</ThirdLevelHeadline>
              <PayoutDetails memberId={memberId} />
            </Card>
          )}
        <Card>
          <ThirdLevelHeadline>Transactions</ThirdLevelHeadline>
          <MemberTransactionsTable
            transactions={
              data.member
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
