import gql from 'graphql-tag'
import moment from 'moment'
import React from 'react'
import { Mutation, Query } from 'react-apollo'
import { Button, Form, Input, Table } from 'semantic-ui-react'

import { Checkmark, Cross } from 'components/icons'
import PayoutDetails from 'components/payouts/payout-details'
import styled from 'react-emotion'
import { Market } from 'api/generated/graphql'
import { formatMoney } from '../../../utils/money'

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

// TODO: "currentMonth" och "previousMonth" är borttagna, se till så att det fortfarande funkar
const GET_MEMBER_QUERY = gql`
  query GetMemberTransactions($id: ID!) {
    member(id: $id) {
      directDebitStatus {
        activated
      }
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

const TableRowColored = styled(Table.Row)(({ transaction }) => {
  if (transaction.type === 'CHARGE') {
    switch (transaction.status) {
      case 'INITIATED':
        return { backgroundColor: '#FFFFDD' } //Yellow
      case 'COMPLETED':
        return { backgroundColor: '#DDFFDD' } //Green
      case 'FAILED':
        return { backgroundColor: '#FF8A80' } //Red
    }
  }
})

const MemberTransactionsTable = ({ transactions }) => (
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
        <TableRowColored key={transaction.id} transaction={transaction}>
          <Table.Cell>{transaction.id}</Table.Cell>
          <Table.Cell>
            <strong>
              {formatMoney(transaction.amount)}
            </strong>
          </Table.Cell>
          <Table.Cell>
            {moment(transaction.timestamp).format('YYYY-MM-DD HH:mm:ss')}
          </Table.Cell>
          <Table.Cell>{transaction.type}</Table.Cell>
          <Table.Cell>{transaction.status}</Table.Cell>
        </TableRowColored>
      ))}
    </Table.Body>
  </Table>
)

class PaymentsTab extends React.Component {
  constructor(props) {
    super(props)
    this.memberId = props.match.params.memberId
    this.state = {
      amount: null,
      confirming: false,
      confirmed: false,
    }
  }

  handleChange = (e) => {
    this.setState({ amount: e.target.value })
  }

  handleChargeSubmit = () => (mutation) => () => {
    mutation({
      variables: {
        id: this.memberId,
        amount: {
          amount: +this.state.amount,
          currency: this.props.contractMarketInfo.preferredCurrency,
        },
      },
    })
    this.setState({ amount: null, confirming: false, confirmed: false })
  }

  handleConfirmation = () => {
    this.setState({ confirming: true })
  }

  handleConfirmationChange = (e) => {
    if (e.target.value.replace(/ /g, '').toLowerCase() === 'a') {
      this.setState({ confirming: false, confirmed: true })
    }
  }

  handleUpdate = (cache, result) => {
    const { transactions } = result.data.chargeMember
    cache.writeQuery({
      query: GET_MEMBER_QUERY,
      data: {
        member: {
          transactions,
        },
      },
    })
  }

  // FIXME: Logic whether charge or payout can be performed should be owned by the backend
  render() {
    return (
      <React.Fragment>
        <Query query={GET_MEMBER_QUERY} variables={{ id: this.memberId }}>
          {({ loading, error, data }) => {
            if (error) {
              return <div>{error.message}!</div>
            }

            if (loading || !data) {
              return <div>Loading...</div>
            }

            return (
              <div>
                <p>
                  Direct Debit activated:{' '}
                  {data.member.directDebitStatus.activated ? (
                    <Checkmark />
                  ) : (
                    <Cross />
                  )}
                </p>
                {data.member.directDebitStatus.activated && (
                  <Mutation
                    mutation={CHARGE_MEMBER_MUTATION}
                    update={this.handleUpdate}
                  >
                    {(chargeMember) => (
                      <div>
                        <h3>Charge:</h3>
                        <Form>
                          <Form.Input
                            onChange={this.handleChange}
                            label={`Charge amount (${this.props.contractMarketInfo.preferredCurrency})`}
                            placeholder="ex. 100"
                            value={this.state.amount}
                          />
                          <br />
                          {!this.state.confirmed && (
                            <Button onClick={this.handleConfirmation}>
                              Charge
                            </Button>
                          )}
                          {this.state.confirming && (
                            <React.Fragment>
                              <br />
                              <br />
                              <Input
                                onChange={this.handleConfirmationChange}
                                focus
                                label="Type a to confirm"
                                placeholder="a"
                              />
                              <br />
                            </React.Fragment>
                          )}
                          {this.state.confirmed && (
                            <React.Fragment>
                              Success!! Press execute, to execute the order
                              <br />
                              <br />
                              <Button
                                positive
                                onClick={this.handleChargeSubmit()(
                                  chargeMember,
                                )}
                              >
                                Execute
                              </Button>
                            </React.Fragment>
                          )}
                        </Form>
                      </div>
                    )}
                  </Mutation>
                )}
                <br />
                {this.props.contractMarketInfo.market === Market.Sweden &&
                  data.member.directDebitStatus.activated && (
                    <>
                      <h3>Payout:</h3>
                      <PayoutDetails {...this.props} />
                    </>
                  )}
                <h3>Transactions:</h3>
                <MemberTransactionsTable
                  transactions={data.member.transactions
                    .slice()
                    .sort(transactionDateSorter)
                    .reverse()}
                />
              </div>
            )
          }}
        </Query>
      </React.Fragment>
    )
  }
}

export default PaymentsTab
