import { Table } from 'semantic-ui-react'
import gql from 'graphql-tag'
import * as React from 'react'
import { Query, Mutation } from 'react-apollo'
import { colors } from '@hedviginsurance/brand'
import styled from 'react-emotion'
import actions from 'store/actions'
import { connect } from 'react-redux'
import { formatMoneySE } from '../../../lib/intl'
import { dateTimeFormatter, MonetaryAmount } from '../../../lib/helpers'

const query = gql`
  query PersonQuery($memberId: ID!) {
    member(id: $memberId) {
      person {
        personFlags
        status {
          flag
          whitelisted
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
        whitelisted {
          whitelistedAt
          whitelistedBy
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
  caseId: string
}

interface PaymentDefaultsTableProps {
  paymentDefaults: Array<PaymentDefault>
}

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

const PaymentDefaultsTable: React.FunctionComponent<
  PaymentDefaultsTableProps
> = ({ paymentDefaults }) => (
  <Table celled>
    <Table.Header>
      <Table.Row>
        <Table.HeaderCell>Year</Table.HeaderCell>
        <Table.HeaderCell>Payment Default Type</Table.HeaderCell>
        <Table.HeaderCell>Debt Amount</Table.HeaderCell>
        <Table.HeaderCell>Claimant</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {[...paymentDefaults]
        .sort(sortPaymentDefaultByYear)
        .map((paymentDefault) => (
          <Table.Row key={paymentDefault.caseId}>
            <Table.Cell>{paymentDefault.year}</Table.Cell>
            <Table.Cell>{paymentDefault.paymentDefaultTypeText}</Table.Cell>
            <Table.Cell>{formatMoneySE(paymentDefault.amount)}</Table.Cell>
            <Table.Cell>{paymentDefault.claimant}</Table.Cell>
          </Table.Row>
        ))}
    </Table.Body>
  </Table>
)

enum Flag {
  GREEN,
  AMBER,
  RED,
}

const ButtonWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
})

const PersonStatusWrapper = styled('div')({
  padding: '10px 15px',
  fontWeight: 700,
  fontSize: '1.5rem',
})

const GreenFlagWrapper = styled('span')({
  color: colors.GREEN,
})

const RedFlagWrapper = styled('span')({
  color: colors.PINK,
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
    background: colors.TURQUOISE,
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

const sortPaymentDefaultByYear = (a, b) => {
  const aDate = new Date(a.year)
  const bDate = new Date(b.year)
  return bDate - aDate
}

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
        <Table.HeaderCell>Date of Debt Check</Table.HeaderCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row>
        <Table.Cell>{formatMoneySE(debt.totalAmountPublicDebt)}</Table.Cell>
        <Table.Cell>{debt.numberPublicDebts}</Table.Cell>
        <Table.Cell>{formatMoneySE(debt.totalAmountPrivateDebt)}</Table.Cell>
        <Table.Cell>{debt.numberPrivateDebts}</Table.Cell>
        <Table.Cell>{dateTimeFormatter(debt.fromDateTime, 'yyyy-MM-dd')}</Table.Cell>
      </Table.Row>
    </Table.Body>
  </Table>
)

interface State {
  confirming: boolean
}

export class MemberDebtComponent extends React.Component<
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
              return <div>Issue retrieving debt for this member</div>
            }
            if (loading || !data) {
              return <div>Loading...</div>
            }
            return (
              <>
                <PersonStatusWrapper>
                  <div>
                    Member flag:{' '}
                    {data.member.person.status.flag === Flag.GREEN ? (
                      <GreenFlagWrapper>
                        {data.member.person.status.flag}
                      </GreenFlagWrapper>
                    ) : (
                      <RedFlagWrapper>
                        {data.member.person.status.flag}
                      </RedFlagWrapper>
                    )}
                  </div>
                </PersonStatusWrapper>
                <PersonStatusWrapper>
                  <div>
                    Member status:{' '}
                    {data.member.person.status.whitelisted
                      ? 'Whitelisted'
                      : 'Not Whitelisted'}
                  </div>
                </PersonStatusWrapper>
                <OverallDebtProfileTable debt={data.member.person.debt} />
                <PaymentDefaultsTable
                  paymentDefaults={data.member.person.debt.paymentDefaults}
                />
                {!data.member.person.status.whitelisted &&
                data.member.person.debt.paymentDefaults.length !== 0 ? (
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
                                    this.handleClick(mutation)
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
                ) : null}
              </>
            )
          }}
        </Query>
      </Wrapper>
    )
  }

  private handleClick = (mutation) => {
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

  private resetButton = () => {
    this.setState({ confirming: false })
  }

  private confirm = () => {
    this.setState({ confirming: true })
  }
}

const mapActions = { ...actions.notificationsActions }

export const MemberDebt = connect(
  null,
  mapActions,
)(MemberDebtComponent)
