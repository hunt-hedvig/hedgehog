import { colors } from '@hedviginsurance/brand'
import { ContractMarketInfo, Market } from 'api/generated/graphql'
import {
  InfoContainer,
  InfoRow,
  InfoText,
} from 'components/member/tabs/contracts-tab/contract'
import gql from 'graphql-tag'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { OrbIndicator } from 'hedvig-ui/orb-indicator'
import { Spacing } from 'hedvig-ui/spacing'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import { dateTimeFormatter, MonetaryAmount } from 'lib/helpers'
import * as React from 'react'
import { Mutation, Query } from 'react-apollo'
import styled from 'react-emotion'
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router'
import { Table } from 'semantic-ui-react'
import actions from 'store/actions'
import { formatMoney } from 'utils/money'

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

const OverallDebtProfile: React.FunctionComponent<{
  debt: DebtProfile
}> = ({ debt }) => (
  <Card span={2}>
    <InfoContainer>
      <InfoRow>
        <ThirdLevelHeadline>Public Debt</ThirdLevelHeadline>
      </InfoRow>

      <InfoRow>
        Total Amount
        <InfoText>
          {formatMoney(debt.totalAmountPublicDebt, {
            minimumFractionDigits: 0,
            useGrouping: true,
          })}
        </InfoText>
      </InfoRow>
      <InfoRow>
        Occurrences <InfoText>{debt.numberPublicDebts}</InfoText>
      </InfoRow>

      <Spacing top={'small'} />
      <InfoRow>
        <ThirdLevelHeadline>Private Debt</ThirdLevelHeadline>
      </InfoRow>

      <InfoRow>
        Total Amount
        <InfoText>
          {formatMoney(debt.totalAmountPrivateDebt, {
            minimumFractionDigits: 0,
            useGrouping: true,
          })}
        </InfoText>
      </InfoRow>
      <InfoRow>
        Occurrences
        <InfoText>{debt.numberPrivateDebts}</InfoText>
      </InfoRow>
      <Spacing top={'small'} />
      <InfoRow>
        Date of Debt Check
        <InfoText>
          {dateTimeFormatter(debt.fromDateTime, 'yyyy-MM-dd')}
        </InfoText>
      </InfoRow>
    </InfoContainer>
  </Card>
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
      <CardsWrapper>
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
                    <Card span={2}>
                      <InfoContainer>
                        <InfoRow>
                          Member flag
                          <InfoText>
                            {data.member.person.status.flag && (
                              <OrbIndicator
                                color={data.member.person.status.flag}
                                size={'tiny'}
                              />
                            )}
                          </InfoText>
                        </InfoRow>
                        <InfoRow>
                          Member status
                          <InfoText>
                            {data.member.person.status.whitelisted
                              ? 'Whitelisted'
                              : 'Not Whitelisted'}
                          </InfoText>
                        </InfoRow>
                      </InfoContainer>
                    </Card>
                    <OverallDebtProfile debt={data.member.person.debt} />
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
      </CardsWrapper>
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
