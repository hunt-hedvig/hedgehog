import { ReferralInformation } from 'api/generated/graphql'
import { CampaignCodeInput } from 'components/member/tabs/campaigns-tab/campaigns/CampaignCodeInput'
import { CampaignsRedeemedTable } from 'components/member/tabs/campaigns-tab/campaigns/CampaignsRedeemedTable'
import { TableHeadline } from 'components/member/tabs/campaigns-tab/styles'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import React from 'react'

export const CampaignsInfo: React.FunctionComponent<{
  memberId: string
  referralInformation: ReferralInformation
}> = ({ memberId, referralInformation }) => {
  return (
    <>
      <TableHeadline>Redeemed campaigns</TableHeadline>
      <CampaignsRedeemedTable
        memberId={memberId}
        campaignsRedeemed={referralInformation.redeemedCampaigns}
      />
      <CardsWrapper>
        <Card>
          <CampaignCodeInput memberId={memberId} />
        </Card>
      </CardsWrapper>
    </>
  )
}
