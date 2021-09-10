import { Card, CardsWrapper } from '@hedvig-ui'
import { CampaignCodeInput } from 'features/member/tabs/campaigns-tab/campaigns/CampaignCodeInput'
import { CampaignsRedeemedTable } from 'features/member/tabs/campaigns-tab/campaigns/CampaignsRedeemedTable'
import { TableHeadline } from 'features/member/tabs/campaigns-tab/styles'
import React from 'react'
import { ReferralInformation } from 'types/generated/graphql'

export const CampaignsInfo: React.FC<{
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
