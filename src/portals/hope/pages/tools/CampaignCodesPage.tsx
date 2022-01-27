import { Card, CardsWrapper, MainHeadline, Spacing } from '@hedvig-ui'
import { CampaignCodeFilter } from 'portals/hope/features/tools/campaign-codes/components/CampaignCodeFilter'
import { CampaignCodeTable } from 'portals/hope/features/tools/campaign-codes/components/CampaignCodeTable'
import { CreateCampaignCode } from 'portals/hope/features/tools/campaign-codes/components/CreateCampaignCode'
import { initialCampaignFilter } from 'portals/hope/features/tools/campaign-codes/utils'
import React from 'react'
import { CampaignFilter } from 'types/generated/graphql'
import { Page } from 'portals/hope/pages/routes'

const CampaignCodesPage: Page = () => {
  const [campaignFilter, setCampaignFilter] = React.useState<CampaignFilter>(
    initialCampaignFilter,
  )

  return (
    <>
      <MainHeadline>Campaign Codes</MainHeadline>
      <Spacing top />
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

export default CampaignCodesPage
