import { Mutation } from '@apollo/client/react/components'
import styled from '@emotion/styled'
import {
  Transaction,
  useGetMemberTransactionsQuery,
} from 'api/generated/graphql'
import { PayoutDetails } from 'components/payouts/payout-details'
import { format, parseISO } from 'date-fns'
import gql from 'graphql-tag'
import { useGetAccount } from 'graphql/use-get-account'
import {
  LoadingMessage,
  StandaloneMessage,
} from 'hedvig-ui/animations/standalone-message'
import { Button } from 'hedvig-ui/button'
import { Spacing } from 'hedvig-ui/spacing'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { toast } from 'react-hot-toast'
import { Table } from 'semantic-ui-react'
import { Market } from 'types/enums'
import { formatMoney } from 'utils/money'
import { Checkmark, Cross } from '../../../icons'
import { GenerateSetupDirectDebitLink } from './generate-setup-direct-debit-link'

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

  const [account] = useGetAccount(memberId)

  const handleChargeSubmit = (mutation) => {
    if (
      !window.confirm(
        `Are you sure you want to charge ${formatMoney(
          account?.currentBalance!,
        )}?`,
      )
    ) {
      return
    }

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
    <div>
      <p>
        Direct Debit activated:{' '}
        {data.member.directDebitStatus?.activated ? <Checkmark /> : <Cross />}
      </p>
      <p>
        Payout Method activated:{' '}
        {data.member.payoutMethodStatus?.activated ? <Checkmark /> : <Cross />}
      </p>

      <Spacing bottom>
        <GenerateSetupDirectDebitLink memberId={memberId} />
      </Spacing>

      {data.member?.directDebitStatus?.activated && (
        <>
          <ThirdLevelHeadline>
            Charge member's current balance:
          </ThirdLevelHeadline>
          {Number(account.currentBalance.amount) > 0.0 ? (
            <Mutation mutation={CHARGE_MEMBER_MUTATION}>
              {(chargeMember) => (
                <>
                  <Button
                    variation="primary"
                    onClick={() => handleChargeSubmit(chargeMember)}
                  >
                    Charge {formatMoney(account.currentBalance!)}
                  </Button>
                </>
              )}
            </Mutation>
          ) : (
            `Unable to charge member since the balance is ${formatMoney(
              account.currentBalance!,
            )}`
          )}
        </>
      )}
      <br />
      {data.member.payoutMethodStatus?.activated &&
        data.member.contractMarketInfo?.market === Market.Sweden && (
          <>
            <h3>Payout:</h3>
            <PayoutDetails memberId={memberId} />
          </>
        )}
      <h3>Transactions:</h3>
      <MemberTransactionsTable
        transactions={
          data.member
            .transactions!.slice()
            .sort(transactionDateSorter)
            .reverse() as Transaction[]
        }
      />
    </div>
  )
}
