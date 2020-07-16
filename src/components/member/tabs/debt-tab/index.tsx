import {
  ContractMarketInfo,
  Debt,
  Market,
  PaymentDefault,
} from 'api/generated/graphql'
import {
  InfoContainer,
  InfoRow,
  InfoText,
} from 'components/member/tabs/contracts-tab/contract'
import { Button } from 'hedvig-ui/button'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { OrbIndicator } from 'hedvig-ui/orb-indicator'
import { Spacing } from 'hedvig-ui/spacing'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import { dateTimeFormatter } from 'lib/helpers'
import * as React from 'react'
import { Query } from 'react-apollo'
import { Table } from 'semantic-ui-react'
import { formatMoney } from 'utils/money'

const PaymentDefaultsTable: React.FunctionComponent<{
  paymentDefaults: PaymentDefault[]
}> = ({ paymentDefaults }) => (
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

const sortPaymentDefaultByYear = (a, b) => {
  const aDate = new Date(a.year)
  const bDate = new Date(b.year)
  return ((bDate as any) as number) - ((aDate as any) as number)
}

const OverallDebtProfile: React.FunctionComponent<{
  debt: Debt
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

export const DebtTab: React.FC<{
  showNotification: (data: any) => void
  contractMarketInfo: ContractMarketInfo
}> = ({ contractMarketInfo }) => {
  // FIXME: We should not make market specific features like this, should use "have debt" or "don't have debt" instead
  if (contractMarketInfo?.market === Market.Norway) {
    return <>Not available for Norway</>
  }

  return (
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
                <CardsWrapper>
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
                    <Spacing top={'large'} />
                    {!data.member.person.status.whitelisted &&
                      data.member.person.debt.paymentDefaults.length !== 0 && (
                        <Button
                          variation="primary"
                          fullWidth
                          onClick={() => {
                            const confirm = window.confirm('Are you sure?')

                            if (confirm) {
                              console.log('AAAAAAAAAAA')
                            }
                          }}
                        >
                          Whitelist Member
                        </Button>
                      )}
                  </Card>
                  <OverallDebtProfile debt={data.member.person.debt} />
                </CardsWrapper>
                <PaymentDefaultsTable
                  paymentDefaults={data.member.person.debt.paymentDefaults}
                />
              </>
            )}
          </>
        )
      }}
    </Query>
  )
}
