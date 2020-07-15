import { ContractMarketInfo } from 'api/generated/graphql'
import { CampaignsInfo } from 'components/member/tabs/campaigns-tab/campaigns/CampaignsInfo'
import { ReferralsInfo } from 'components/member/tabs/campaigns-tab/referrals/ReferralsInfo'
import { useGetReferralInformation } from 'graphql/use-get-referral-information'
import { MainHeadline } from 'hedvig-ui/typography'
import React from 'react'
import styled from 'react-emotion'

const Headline = styled(MainHeadline)`
  display: flex;
  align-items: center;
`

export const CampaignsTab: React.FunctionComponent<{
  memberId: string
  contractMarketInfo: ContractMarketInfo
}> = ({ memberId, contractMarketInfo }) => {
  const [referralInformation, { loading, error }] = useGetReferralInformation(
    memberId,
  )

  if (loading) {
    return <>Loading...</>
  }

  if (error || !referralInformation) {
    return <>Something went wrong!</>
  }

  return (
    <>
      <Headline>Campaigns</Headline>
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
