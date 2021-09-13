import { Card, CardsWrapper, MainHeadline } from '@hedvig-ui'
import { CampaignCodeFilter } from 'features/tools/campaign-codes/components/CampaignCodeFilter'
import { CampaignCodeTable } from 'features/tools/campaign-codes/components/CampaignCodeTable'
import { CreateCampaignCode } from 'features/tools/campaign-codes/components/CreateCampaignCode'
import { initialCampaignFilter } from 'features/tools/campaign-codes/utils'
import React from 'react'
import { CampaignFilter } from 'types/generated/graphql'

export const CampaignCodesPage: React.FC = () => {
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
