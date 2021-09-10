import { Card, CardsWrapper, MainHeadline } from '@hedvig-ui'
import { CampaignFilter } from 'api/generated/graphql'
import { CampaignCodeFilter } from 'features/tools/campaign-codes/components/CampaignCodeFilter'
import { CampaignCodeTable } from 'features/tools/campaign-codes/components/CampaignCodeTable'
import { CreateCampaignCode } from 'features/tools/campaign-codes/components/CreateCampaignCode'
import { initialCampaignFilter } from 'features/tools/campaign-codes/utils'
import React from 'react'

export const CampaignCodeInfo: React.FC = () => {
  const [campaignFilter, setCampaignFilter] = React.useState<CampaignFilter>(
    initialCampaignFilter,
  )

  return (
    <>
      <MainHeadline>Campaign Codes</MainHeadline>
      <CardsWrapper>
        <Card span={2}>
          <CampaignCodeFilter
            filter={campaignFilter}
            setFilter={setCampaignFilter}
          />
        </Card>
        <Card span={2}>
          <CreateCampaignCode />
        </Card>
        <CampaignCodeTable filter={campaignFilter} />
      </CardsWrapper>
    </>
  )
}
