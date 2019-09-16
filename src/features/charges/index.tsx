import { colors } from '@hedviginsurance/brand'
import gql from 'graphql-tag'
import { formatMoneySE } from 'lib/intl'
import * as moment from 'moment'
import * as React from 'react'
import { Mutation, Query } from 'react-apollo'
import styled from 'react-emotion'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Table } from 'semantic-ui-react'
import { MonetaryAmount } from 'src/lib/helpers'
import actions from 'store/actions'

const query = gql`
  query PaymentScheduleQuery($month: YearMonth!) {
    paymentSchedule(status: SUBSCRIPTION_SCHEDULED_AND_WAITING_FOR_APPROVAL) {
      id
      member {
        memberId
        firstName
        lastName
        monthlySubscription(month: $month) {
          amount
        }
        account {
          currentBalance
        }
      }
      status
      amount
    }
  }
`
const approveMemberCharge = gql`
  mutation approveMemberCharge($approvals: [MemberChargeApproval!]!) {
    approveMemberCharge(approvals: $approvals)
  }
`

const Wrapper = styled('div')({
  padding: '0 20px',
})

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
    memberId: string
    firstName: string
    lastName: string
    monthlySubscription: {
      amount: MonetaryAmount
    }
    account: {
      currentBalance: MonetaryAmount
    }
  }
  chargeStatus: string
  amount: MonetaryAmount
}

interface RowProps {
  paymentSchedule: PaymentSchedule[]
}

const Row: React.FunctionComponent<RowProps> = ({ paymentSchedule }) => (
  <>
    {paymentSchedule.map((payment) => (
      <TableRow
        key={payment.id}
        warning={
          payment.member.account.currentBalance.amount !==
          payment.member.monthlySubscription.amount.amount
        }
      >
        <Table.Cell>
          {payment.member.firstName + ' ' + payment.member.lastName}
        </Table.Cell>
        <Table.Cell>
          <Link to={`/members/${payment.member.memberId}`}>
            {payment.member.memberId}
          </Link>
        </Table.Cell>
        <Table.Cell>
          {formatMoneySE(payment.member.monthlySubscription.amount)}
        </Table.Cell>
        <Table.Cell>
          {formatMoneySE(payment.member.account.currentBalance)}
          {parseFloat(payment.member.account.currentBalance.amount) <= 0 &&
            " (Won't be charged)"}
        </Table.Cell>
      </TableRow>
    ))}
  </>
)

interface State {
  confirming: boolean
}

export class ChargePageComponent extends React.Component<
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
          variables={{ month: moment().format('YYYY-MM') }}
        >
          {({ loading, error, data }) => {
            if (error) {
              return (
                <Table.Row>
                  Error in GraphQl query here:{' '}
                  <pre>{JSON.stringify(error, null, 2)}</pre>
                </Table.Row>
              )
            }
            if (loading || !data || !data.paymentSchedule) {
              return <div>Loading...</div>
            }
            return (
              <>
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
                    <Row paymentSchedule={data.paymentSchedule} />
                  </Table.Body>
                </Table>
                <ButtonWrapper>
                  <Mutation
                    mutation={approveMemberCharge}
                    refetchQueries={() => [
                      {
                        query,
                        variables: { month: moment().format('YYYY-MM') },
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
                                      approvals: data.paymentSchedule.map(
                                        (payment) => ({
                                          memberId: payment.member.memberId,
                                          amount:
                                            payment.member.account
                                              .currentBalance,
                                        }),
                                      ),
                                    },
                                  })
                                    .then(() => {
                                      this.resetButton()
                                      this.props.showNotification({
                                        message: 'Charges sent for approval',
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
                          {this.state.confirming ? "Yes, I'm sure" : 'Do it'}
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

const mapActions = { ...actions.notificationsActions }

export const ChargePage = connect(
  null,
  mapActions,
)(ChargePageComponent)