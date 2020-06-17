import { colors } from '@hedviginsurance/brand'
import { ContractMarketInfo, Market } from 'api/generated/graphql'
import gql from 'graphql-tag'
import { dateTimeFormatter, MonetaryAmount } from 'lib/helpers'
import * as React from 'react'
import { Mutation, Query } from 'react-apollo'
import styled from 'react-emotion'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Table } from 'semantic-ui-react'
import actions from 'store/actions'
import { formatMoney } from 'utils/money'
import { OrbIndicator } from 'hedvig-ui/orb-indicator'

const query = gql`
  query PersonQuery($memberId: ID!) {
    member(id: $memberId) {
      memberId
      person {
        debtFlag
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
  paymentDefaults: PaymentDefault[]
}

interface DebtProfile {
  totalAmountPublicDebt: MonetaryAmount
  numberPublicDebts: BigInteger
  totalAmountPrivateDebt: MonetaryAmount
  numberPrivateDebts: BigInteger
  fromDateTime: string
}

interface OverallDebtProfileTableProps {
  debt: DebtProfile
}

const PaymentDefaultsTable: React.FunctionComponent<PaymentDefaultsTableProps> = ({
  paymentDefaults,
}) => (
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
            <Table.Cell>{formatMoney(paymentDefault.amount)}</Table.Cell>
            <Table.Cell>{paymentDefault.claimant}</Table.Cell>
          </Table.Row>
        ))}
    </Table.Body>
  </Table>
)

const ButtonWrapper = styled('div')({
  display: 'flex',
  justifyContent: 'flex-end',
})

const PersonStatusWrapper = styled('div')({
  padding: '10px 15px',
  fontWeight: 700,
  fontSize: '1.5rem',
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
  return ((bDate as any) as number) - ((aDate as any) as number)
}

const OverallDebtProfileTable: React.FunctionComponent<OverallDebtProfileTableProps> = ({
  debt,
}) => (
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
        <Table.Cell>{formatMoney(debt.totalAmountPublicDebt)}</Table.Cell>
        <Table.Cell>{debt.numberPublicDebts}</Table.Cell>
        <Table.Cell>{formatMoney(debt.totalAmountPrivateDebt)}</Table.Cell>
        <Table.Cell>{debt.numberPrivateDebts}</Table.Cell>
        <Table.Cell>
          {dateTimeFormatter(debt.fromDateTime, 'yyyy-MM-dd')}
        </Table.Cell>
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
    contractMarketInfo: ContractMarketInfo
  } & RouteComponentProps<{
    memberId: string
  }>,
  State
> {
  public state = {
    confirming: false,
  }

  public render() {
    // FIXME: We should not make market specific features like this, should use "have debt" or "don't have debt" instead
    if (this.props.contractMarketInfo?.market === Market.Norway) {
      return <>Not available for Norway</>
    }
    return (
      <Wrapper>
        <Query<any>
          query={query}
          variables={{ memberId: this.props.match.params.memberId }}
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
                {!data.member || !data.member.person ? (
                  'Issue retrieving debt for this member'
                ) : (
                  <>
                    <PersonStatusWrapper>
                      <div>
                        <OrbIndicator
                          color={data.member.person.status.flag.toLowerCase()}
                          text={'Member flag: '}
                        />
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
                              variables: {
                                memberId: this.props.match.params.memberId,
                              },
                            },
                          ]}
                        >
                          {(mutation, { loading: loadingMutation }) => {
                            return (
                              <Button
                                disabled={loadingMutation}
                                onClick={
                                  this.state.confirming
                                    ? () => {
                                        if (loadingMutation) {
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
                )}
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
        memberId: this.props.match.params.memberId,
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

export const MemberDebt = connect(null, mapActions)(MemberDebtComponent)
