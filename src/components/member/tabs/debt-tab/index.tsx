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
import { useGetPerson } from 'graphql/use-get-person'
import { Button } from 'hedvig-ui/button'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { OrbIndicator } from 'hedvig-ui/orb-indicator'
import { Spacing } from 'hedvig-ui/spacing'
import { MainHeadline, ThirdLevelHeadline } from 'hedvig-ui/typography'
import { dateTimeFormatter } from 'lib/helpers'
import * as React from 'react'
import { ArrowRepeat } from 'react-bootstrap-icons'
import styled, { css, keyframes } from 'react-emotion'
import { Table } from 'semantic-ui-react'
import { formatMoney } from 'utils/money'

const Headline = styled(MainHeadline)`
  display: flex;
  align-items: center;
`

const spin = keyframes`
  from{transform: rotate(0deg)}
  to{transform: rotate(360deg)}
`
const RefreshButton = styled.button<{ loading: boolean }>`
  background: transparent;
  font-size: 0.875em;
  color: ${({ theme }) => theme.mutedText};
  padding: 0;
  border: 0;
  margin-left: 1rem;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  transition: transform 500ms;
  ${({ loading }) =>
    loading &&
    css`
      animation: ${spin} 500ms linear infinite;
    `};
`

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
  memberId: string
  contractMarketInfo: ContractMarketInfo
}> = ({ memberId, contractMarketInfo }) => {
  const [person, { loading, error, refetch }] = useGetPerson(memberId)

  // FIXME: We should not make market specific features like this, should use "have debt" or "don't have debt" instead
  if (contractMarketInfo?.market === Market.Norway) {
    return <>Not available for Norway</>
  }

  if (loading) {
    return (
      <>
        <Headline>
          Debt
          <RefreshButton onClick={() => refetch()} loading={loading}>
            <ArrowRepeat />
          </RefreshButton>
        </Headline>
        Loading...
      </>
    )
  }

  if (error || !person) {
    return (
      <>
        <Headline>
          Debt
          <RefreshButton onClick={() => refetch()} loading={loading}>
            <ArrowRepeat />
          </RefreshButton>
        </Headline>
        Issue retrieving debt for this member
      </>
    )
  }

  return (
    <>
      <Headline>
        Debt
        <RefreshButton onClick={() => refetch()} loading={loading}>
          <ArrowRepeat />
        </RefreshButton>
      </Headline>
      <CardsWrapper>
        <Card span={2}>
          <InfoContainer>
            <InfoRow>
              Member flag
              <InfoText>
                {person.status.flag && (
                  <OrbIndicator color={person.status.flag} size={'tiny'} />
                )}
              </InfoText>
            </InfoRow>
            <InfoRow>
              Member status
              <InfoText>
                {person.status.whitelisted ? 'Whitelisted' : 'Not Whitelisted'}
              </InfoText>
            </InfoRow>
          </InfoContainer>
          <Spacing top={'large'} />
          {!person.status.whitelisted &&
            person.debt.paymentDefaults.length !== 0 && (
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
        <OverallDebtProfile debt={person.debt} />
      </CardsWrapper>
      <PaymentDefaultsTable paymentDefaults={person.debt.paymentDefaults} />
    </>
  )
}
