import {
  Card,
  CardsWrapper,
  FadeIn,
  InfoContainer,
  InfoRow,
  InfoText,
  LoadingMessage,
  MainHeadline,
  OrbFlagsType,
  OrbIndicator,
  Spacing,
  StandaloneMessage,
} from '@hedvig-ui'
import { Market, PickedLocaleMarket } from 'features/config/constants'
import { WhitelistMemberButton } from 'features/member/tabs/debt-tab/WhitelistMemberButton'
import { RefreshButton } from 'features/member/tabs/shared/refresh-button'
import { useGetPerson } from 'graphql/member/use-get-person'
import React from 'react'
import { ArrowRepeat } from 'react-bootstrap-icons'

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
    contractMarketInfo?.market ?? PickedLocaleMarket[pickedLocale!]

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
                  <OrbIndicator
                    flag={person.status.flag.toLowerCase() as OrbFlagsType}
                    size="14px"
                  />
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
              <Spacing top="large" />
              <WhitelistMemberButton memberId={memberId} />
            </>
          )}
        </Card>
      </CardsWrapper>
    </FadeIn>
  )
}
