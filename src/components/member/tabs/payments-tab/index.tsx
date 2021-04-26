import { Mutation } from '@apollo/client/react/components'
import styled from '@emotion/styled'
import {
  Transaction,
  useGetMemberTransactionsQuery,
} from 'api/generated/graphql'
import {
  PayoutDetails,
  PayoutFormData,
} from 'components/payouts/payout-details'
import { format, parseISO } from 'date-fns'
import gql from 'graphql-tag'
import {
  LoadingMessage,
  StandaloneMessage,
} from 'hedvig-ui/animations/standalone-message'
import { Button } from 'hedvig-ui/button'
import { Spacing } from 'hedvig-ui/spacing'
import React, { useState } from 'react'
import { Form, Input, Table } from 'semantic-ui-react'
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
}>`
  td {
    background-color: ${({ status }) => {
      switch (status) {
        case 'INITIATED':
          return '#FFFFDD'
        case 'COMPLETED':
          return '#DDFFDD'
        case 'FAILED':
          return '#FF8A80'
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
        <TableRowColored key={transaction.id} status={transaction.status!}>
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
  payoutRequest: (payoutFormData: PayoutFormData, memberId: string) => void
}> = ({ memberId, payoutRequest }) => {
  const { data, loading, error } = useGetMemberTransactionsQuery({
    variables: { id: memberId },
  })

  const [amount, setAmount] = useState<null | number>(null)
  const [confirming, setConfirming] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const handleChange = (e) => {
    setAmount(+e.target.value)
  }

  const handleChargeSubmit = (mutation) => {
    mutation({
      variables: {
        id: memberId,
        amount: {
          amount,
          currency: data?.member?.contractMarketInfo?.preferredCurrency,
        },
      },
    }).then(() => {
      setAmount(null)
    })
  }

  const handleConfirmation = () => {
    setConfirming(true)
  }

  const handleConfirmationChange = (e) => {
    if (!confirming) {
      return
    }
    if (e.target.value.replace(/ /g, '').toLowerCase() === 'a') {
      setConfirmed(true)
    }
  }

  if (error) {
    return (
      <StandaloneMessage paddingTop="10vh">
        Something went wrong
      </StandaloneMessage>
    )
  }

  if (loading || !data?.member) {
    return <LoadingMessage paddingTop="10vh" />
  }

  return (
    <div>
      <p>
        Direct Debit activated:{' '}
        {data.member?.directDebitStatus?.activated ? <Checkmark /> : <Cross />}
      </p>
      <p>
        Payout Method activated:{' '}
        {data.member?.payoutMethodStatus?.activated ? <Checkmark /> : <Cross />}
      </p>

      <Spacing bottom>
        <GenerateSetupDirectDebitLink memberId={memberId} />
      </Spacing>

      {data.member?.directDebitStatus?.activated && (
        <Mutation mutation={CHARGE_MEMBER_MUTATION}>
          {(chargeMember) => (
            <div>
              <h3>Charge:</h3>
              <Form>
                <Form.Input
                  onChange={handleChange}
                  label={`Charge amount (${data?.member?.contractMarketInfo?.preferredCurrency})`}
                  placeholder="ex. 100"
                  value={amount}
                />
                <br />
                {!confirmed && (
                  <Button variation="primary" onClick={handleConfirmation}>
                    Charge
                  </Button>
                )}
                {confirming && (
                  <>
                    <br />
                    <br />
                    <Input
                      onChange={handleConfirmationChange}
                      focus
                      label="Type a to confirm"
                      placeholder="a"
                    />
                    <br />
                  </>
                )}
                {confirmed && (
                  <>
                    Success!! Press execute, to execute the order
                    <br />
                    <br />
                    <Button onClick={() => handleChargeSubmit(chargeMember)}>
                      Execute
                    </Button>
                  </>
                )}
              </Form>
            </div>
          )}
        </Mutation>
      )}
      <br />
      {data.member?.payoutMethodStatus?.activated &&
        data?.member?.contractMarketInfo?.market === Market.Sweden && (
          <>
            <h3>Payout:</h3>
            <PayoutDetails memberId={memberId} payoutRequest={payoutRequest} />
          </>
        )}
      <h3>Transactions:</h3>
      <MemberTransactionsTable
        transactions={
          data!
            .member!.transactions!.slice()
            .sort(transactionDateSorter)
            .reverse() as Transaction[]
        }
      />
    </div>
  )
}

export default PaymentsTab
