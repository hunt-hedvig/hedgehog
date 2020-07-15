import { ReferralInformation } from 'api/generated/graphql'
import { CampaignCodeInput } from 'components/member/tabs/campaigns-tab/campaigns/CampaignCodeInput'
import { CampaignsRedeemedTable } from 'components/member/tabs/campaigns-tab/campaigns/CampaignsRedeemedTable'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'

export const CampaignsInfo: React.FunctionComponent<{
  memberId: string
  referralInformation: ReferralInformation
}> = ({ memberId, referralInformation }) => {
  return (
    <>
      <ThirdLevelHeadline>Redeemed campaigns</ThirdLevelHeadline>
      <CardsWrapper>
        <Card>
          <CampaignsRedeemedTable
            memberId={memberId}
            campaignsRedeemed={referralInformation.redeemedCampaigns}
          />
        </Card>
        <Card>
          <CampaignCodeInput memberId={memberId} />
        </Card>
      </CardsWrapper>
    </>
  )
}
