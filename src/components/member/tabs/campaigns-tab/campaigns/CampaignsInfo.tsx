import { CampaignCodeInput } from 'components/member/tabs/campaigns-tab/campaigns/CampaignCodeInput'
import { CampaignsRedeemedTable } from 'components/member/tabs/campaigns-tab/campaigns/CampaignsRedeemedTable'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'

export const CampaignsInfo: React.FunctionComponent<{ memberId: string }> = ({
  memberId,
}) => {
  return (
    <>
      <ThirdLevelHeadline>Redeemed campaigns</ThirdLevelHeadline>
      <CardsWrapper>
        <Card span={2}>
          <CampaignsRedeemedTable />
        </Card>
        <Card span={2}>
          <CampaignCodeInput memberId={memberId} />
        </Card>
      </CardsWrapper>
    </>
  )
}
