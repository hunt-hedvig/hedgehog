import {
  ContractMarketInfo,
  Market,
  PaymentDefault,
} from 'api/generated/graphql'
import { OverallDebtProfile } from 'components/member/tabs/debt-tab/OverallDebtProfile'
import { PaymentDefaultsTable } from 'components/member/tabs/debt-tab/PaymentDefaultsTable'
import { WhitelistMemberButton } from 'components/member/tabs/debt-tab/WhitelistMemberButton'
import {
  InfoContainer,
  InfoRow,
  InfoText,
} from 'components/member/tabs/shared/card-components'
import { Headline } from 'components/member/tabs/shared/headline'
import { RefreshButton } from 'components/member/tabs/shared/refresh-button'
import { useGetPerson } from 'graphql/use-get-person'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { OrbIndicator } from 'hedvig-ui/orb-indicator'
import { Spacing } from 'hedvig-ui/spacing'
import React from 'react'
import { ArrowRepeat } from 'react-bootstrap-icons'

export const DebtTab: React.FC<{
  memberId: string
  contractMarketInfo: ContractMarketInfo
}> = ({ memberId, contractMarketInfo }) => {
  const [person, { loading, error, refetch }] = useGetPerson(memberId)

  const eligibleForWhitelist =
    !person?.status?.whitelisted && person?.debt?.paymentDefaults?.length !== 0

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
                {person?.status?.flag && (
                  <OrbIndicator color={person.status.flag} size={'tiny'} />
                )}
              </InfoText>
            </InfoRow>
            <InfoRow>
              Member status
              <InfoText>
                {person?.status?.whitelisted
                  ? 'Whitelisted'
                  : 'Not Whitelisted'}
              </InfoText>
            </InfoRow>
          </InfoContainer>
          <Spacing top={'large'} />
          {eligibleForWhitelist && (
            <WhitelistMemberButton memberId={memberId} />
          )}
        </Card>
        {person?.debt && <OverallDebtProfile debt={person.debt} />}
      </CardsWrapper>
      {person?.debt?.paymentDefaults && (
        <PaymentDefaultsTable
          paymentDefaults={person.debt.paymentDefaults as PaymentDefault[]}
        />
      )}
    </>
  )
}
