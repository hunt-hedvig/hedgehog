import {
  FadeIn,
  LoadingMessage,
  MainHeadline,
  StandaloneMessage,
} from '@hedvig-ui'
import { CampaignsInfo } from 'components/member/tabs/campaigns-tab/campaigns/CampaignsInfo'
import { ReferralsInfo } from 'components/member/tabs/campaigns-tab/referrals/ReferralsInfo'
import { RefreshButton } from 'components/member/tabs/shared/refresh-button'
import { useGetReferralInformation } from 'graphql/use-get-referral-information'
import React from 'react'
import { ArrowRepeat } from 'react-bootstrap-icons'

export const CampaignsTab: React.FC<{
  memberId: string
}> = ({ memberId }) => {
  const [
    referralInformation,
    { loading, error, refetch },
  ] = useGetReferralInformation(memberId)

  if (loading) {
    return <LoadingMessage paddingTop="10vh" />
  }

  if (error || !referralInformation) {
    return (
      <StandaloneMessage paddingTop="10vh">
        Something went wrong
      </StandaloneMessage>
    )
  }

  return (
    <FadeIn>
      <MainHeadline>
        Campaigns
        <RefreshButton onClick={() => refetch()} loading={loading}>
          <ArrowRepeat />
        </RefreshButton>
      </MainHeadline>
      <CampaignsInfo
        memberId={memberId}
        referralInformation={referralInformation}
      />

      <ReferralsInfo referralInformation={referralInformation} />
    </FadeIn>
  )
}
