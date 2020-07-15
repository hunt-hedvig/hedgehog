import { ContractMarketInfo } from 'api/generated/graphql'
import { CampaignsInfo } from 'components/member/tabs/campaigns-tab/campaigns/CampaignsInfo'
import { ReferralsInfo } from 'components/member/tabs/campaigns-tab/referrals/ReferralsInfo'
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
  return (
    <>
      <Headline>Campaigns</Headline>
      <CampaignsInfo memberId={memberId} />

      <Headline>Referrals</Headline>
      <ReferralsInfo memberId={memberId} market={contractMarketInfo?.market} />
    </>
  )
}
