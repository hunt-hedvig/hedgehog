import { MonetaryAmount } from '../../../components/claims/claim-details/components/ClaimPayments'
import { Table } from 'semantic-ui-react'
import gql from 'graphql-tag'
import * as React from 'react'
import { Query, Mutation } from 'react-apollo'
import { colors } from '@hedviginsurance/brand'
import styled from 'react-emotion'
import actions from 'store/actions'
import { connect } from 'react-redux'

const query = gql`
  query PersonQuery($memberId: ID!) {
    member(id: $memberId) {
      person {
        personFlags
        personStatus {
          flag
          isWhitelisted
        }
        debt {
          paymentDefaults {
            year
            week
            paymentDefaultType
            paymentDefaultTypeText
            amount
            caseId
            claimant
          }
          numberPublicDebts
          totalAmountPublicDebt
          numberPrivateDebts
          totalAmountPrivateDebt
          totalAmountDebt
          fromDateTime
        }
      }
    }
  }
`

const whitelistMember = gql`
  mutation whitelistMember($memberId: ID!) {
    whitelistMember(memberId: $memberId)
  }
`
interface PaymentDefault {
  year: BigInteger
  paymentDefaultType: string
  paymentDefaultTypeText: string
  amount: MonetaryAmount
  claimant: string
}

interface PaymentDefaultsTableProps {
  paymentDefaults: Array<PaymentDefault>
}

const PaymentDefaultsTable: React.FunctionComponent<
  PaymentDefaultsTableProps
> = ({ paymentDefaults }) => (
  <Table celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Year</Table.HeaderCell>
        <Table.HeaderCell>Payment Default Type Code</Table.HeaderCell>
        <Table.HeaderCell>Payment Default Type</Table.HeaderCell>
        <Table.HeaderCell>Debt Amount</Table.HeaderCell>
        <Table.HeaderCell>Claimant</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {[...paymentDefaults].map((paymentDefault) => (
        <Table.Row>
          {/* <Table.Row key={}> */}
          <Table.Cell>{paymentDefault.year}</Table.Cell>
          <Table.Cell>{paymentDefault.paymentDefaultType}</Table.Cell>
          <Table.Cell>{paymentDefault.paymentDefaultTypeText}</Table.Cell>
          <Table.Cell>
            {paymentDefault.amount.amount} {paymentDefault.amount.currency}
          </Table.Cell>
          <Table.Cell>{paymentDefault.claimant}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table>
)

interface DebtProfile {
  totalAmountPublicDebt: MonetaryAmount
  numberPublicDebts: BigInteger
  totalAmountPrivateDebt: MonetaryAmount
  numberPrivateDebts: BigInteger
  fromDateTime: LocalDateTime
}

interface OverallDebtProfileTableProps {
  debt: DebtProfile
}

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

const Wrapper = styled('div')({
  padding: '0 20px',
})

const ConfirmMessage = styled('div')({
  padding: '12px',
  alignItems: 'center',
  color: colors.OFF_BLACK_DARK,
  fontSize: '1.2rem',
})

const OverallDebtProfileTable: React.FunctionComponent<
  OverallDebtProfileTableProps
> = ({ debt }) => (
  <Table celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Total Amount of Public Debt</Table.HeaderCell>
        <Table.HeaderCell>Number of Public Debts</Table.HeaderCell>
        <Table.HeaderCell>Total Amount of Private Debt</Table.HeaderCell>
        <Table.HeaderCell>Number of Private Debts</Table.HeaderCell>
        <Table.HeaderCell>Data Valid From</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.Cell>
          {debt.totalAmountPublicDebt.amount}{' '}
          {debt.totalAmountPublicDebt.currency}
        </Table.Cell>
        <Table.Cell>{debt.numberPublicDebts}</Table.Cell>
        <Table.Cell>
          {debt.totalAmountPrivateDebt.amount}{' '}
          {debt.totalAmountPrivateDebt.currency}
        </Table.Cell>
        <Table.Cell>{debt.numberPrivateDebts}</Table.Cell>
        <Table.Cell>{debt.fromDateTime}</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
)

interface State {
  confirming: boolean
}

class MemberDebtComponent extends React.Component<
  {
    showNotification: (data: any) => void
  },
  State
> {
  public state = {
    confirming: false,
  }

  public render() {
    return (
      <Wrapper>
        <Query<any>
          query={query}
          variables={{ memberId: this.props.match.params.id }}
        >
          {({ loading, error, data }) => {
            if (error) {
              return (
                <div>
                  Issue retrieving debt for this member Error in GraphQl query
                  here.....: <pre>{JSON.stringify(error, null, 2)}</pre>
                </div>
              )
            }
            if (loading || !data) {
              return <div>Loading...</div>
            }
            if (data.member.person.debt.paymentDefaults.length === 0) {
              return <div>No payment defaults for this member</div>
            }
            return (
              <>
                <OverallDebtProfileTable debt={data.member.person.debt} />
                <PaymentDefaultsTable
                  paymentDefaults={data.member.person.debt.paymentDefaults}
                />
                <ButtonWrapper>
                  <Mutation
                    mutation={whitelistMember}
                    refetchQueries={() => [
                      {
                        query,
                        variables: { memberId: this.props.match.params.id },
                      },
                    ]}
                  >
                    {(mutation, { loading }) => {
                      return (
                        <Button
                          disabled={loading}
                          onClick={
                            this.state.confirming
                              ? () => {
                                  if (loading) {
                                    return
                                  }
                                  mutation({
                                    variables: {
                                      memberId: this.props.match.params.id,
                                    },
                                  })
                                    .then(() => {
                                      this.resetButton()
                                      this.props.showNotification({
                                        message: 'Member has been whitelisted',
                                        header: 'Approved',
                                        type: 'olive',
                                      })
                                    })
                                    .catch((error) => {
                                      this.props.showNotification({
                                        message: error.message,
                                        header: 'Error',
                                        type: 'red',
                                      })
                                      throw error
                                    })
                                }
                              : this.confirm
                          }
                        >
                          {this.state.confirming
                            ? "Yes, I'm sure"
                            : 'White List Member'}
                        </Button>
                      )
                    }}
                  </Mutation>
                  {this.state.confirming ? (
                    <ConfirmMessage>Are you sure?</ConfirmMessage>
                  ) : null}
                </ButtonWrapper>
              </>
            )
          }}
        </Query>
      </Wrapper>
    )
  }
  private resetButton = () => {
    this.setState({ confirming: false })
  }

  private confirm = () => {
    this.setState({ confirming: true })
  }
}
// }

const mapActions = { ...actions.notificationsActions }

export default MemberDebtComponent

export const MemberDebt = connect(
  null,
  mapActions,
)(MemberDebtComponent)
