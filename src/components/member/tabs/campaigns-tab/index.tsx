import { ContractMarketInfo } from 'api/generated/graphql'
import { CampaignsInfo } from 'components/member/tabs/campaigns-tab/campaigns/CampaignsInfo'
import { ReferralsInfo } from 'components/member/tabs/campaigns-tab/referrals/ReferralsInfo'
import {
  Headline,
  RefreshButton,
} from 'components/member/tabs/campaigns-tab/styles'
import { useGetReferralInformation } from 'graphql/use-get-referral-information'
import React from 'react'
import { ArrowRepeat } from 'react-bootstrap-icons'

export const CampaignsTab: React.FunctionComponent<{
  memberId: string
  contractMarketInfo: ContractMarketInfo
}> = ({ memberId, contractMarketInfo }) => {
  const [
    referralInformation,
    { loading, error, refetch },
  ] = useGetReferralInformation(memberId)

  if (loading) {
    return (
      <>
        <Headline>Campaigns</Headline>
        Loading...
      </>
    )
  }

  if (error || !referralInformation) {
    return (
      <>
        <Headline>
          Campaigns
          <RefreshButton onClick={() => refetch()} loading={loading}>
            <ArrowRepeat />
          </RefreshButton>
        </Headline>
        Something went wrong!
      </>
    )
  }

  return (
    <>
      <Headline>
        Campaigns
        <RefreshButton onClick={() => refetch()} loading={loading}>
          <ArrowRepeat />
        </RefreshButton>
      </Headline>
      <CampaignsInfo
        memberId={memberId}
        referralInformation={referralInformation}
      />

      <Headline>Referrals</Headline>
      <ReferralsInfo
        memberId={memberId}
        referralInformation={referralInformation}
        market={contractMarketInfo?.market}
      />
    </>
  )
}
