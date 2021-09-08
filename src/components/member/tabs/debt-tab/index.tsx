import { Card, CardsWrapper } from '@hedvig-ui'
import { WhitelistMemberButton } from 'components/member/tabs/debt-tab/WhitelistMemberButton'
import { RefreshButton } from 'components/member/tabs/shared/refresh-button'
import { useGetPerson } from 'graphql/use-get-person'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import {
  LoadingMessage,
  StandaloneMessage,
} from 'hedvig-ui/animations/standalone-message'
import { InfoContainer, InfoRow, InfoText } from 'hedvig-ui/info-row'
import { FlagOrbIndicator } from 'hedvig-ui/orb-indicator'
import { Spacing } from 'hedvig-ui/spacing'
import { MainHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { ArrowRepeat } from 'react-bootstrap-icons'
import { Market } from 'types/enums'
import { getMarketFromPickedLocale } from 'utils/member'

export const DebtTab: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const [
    { person, contractMarketInfo, pickedLocale },
    { loading, error, refetch },
  ] = useGetPerson(memberId)

  if (loading) {
    return <LoadingMessage paddingTop="10vh" />
  }

  if (error) {
    return (
      <StandaloneMessage paddingTop="10vh">
        Issue communicating with system, please contact Tech
      </StandaloneMessage>
    )
  }

  // FIXME: We should not make market specific features like this, should use "have debt" or "don't have debt" instead
  const memberMarket =
    contractMarketInfo?.market ?? getMarketFromPickedLocale(pickedLocale!)
  if (memberMarket !== Market.Sweden) {
    return (
      <StandaloneMessage paddingTop="10vh">
        Only available in Sweden
      </StandaloneMessage>
    )
  }

  if (!person) {
    return (
      <StandaloneMessage paddingTop="10vh">
        Issue retrieving debt info for this member
      </StandaloneMessage>
    )
  }

  const isEligibleForWhitelist = (): boolean => {
    if (!!person?.status?.whitelisted) {
      return false
    }
    if ((person?.debt?.paymentDefaults?.length ?? 0) > 0) {
      return true
    }
    if ((person?.debt?.totalAmountDebt.amount ?? 0) > 0) {
      return true
    }
    return false
  }

  const eligibleForWhitelist = isEligibleForWhitelist()

  return (
    <FadeIn>
      <MainHeadline>
        Debt
        <RefreshButton onClick={() => refetch()} loading={loading}>
          <ArrowRepeat />
        </RefreshButton>
      </MainHeadline>
      <CardsWrapper>
        <Card span={1}>
          <InfoContainer>
            <InfoRow>
              Member flag
              <InfoText>
                {person?.status?.flag && (
                  <FlagOrbIndicator flag={person.status.flag} size={'tiny'} />
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
          {eligibleForWhitelist && (
            <>
              <Spacing top={'large'} />
              <WhitelistMemberButton memberId={memberId} />
            </>
          )}
        </Card>
      </CardsWrapper>
    </FadeIn>
  )
}
