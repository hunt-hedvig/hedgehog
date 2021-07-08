import styled from '@emotion/styled'
import {
  StagingTools,
  stagingToolsAvailable,
} from 'features/tools/staging-tools'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import { Card, CardsWrapper } from 'hedvig-ui/card'
import React from 'react'

const Icon = styled('div')`
  font-size: 2rem;
  padding-bottom: 1rem;
`

export const Tools: React.FC = () => (
  <FadeIn>
    <CardsWrapper>
      <Card to="/tools/charges" span={4}>
        <Icon>💰</Icon>
        Approve Charges
      </Card>
      <Card to="/tools/switcher-automation" span={4}>
        <Icon>🏡</Icon>
        Switcher Automation
      </Card>
      <Card to="/tools/perils-editor" span={4}>
        <Icon>📝</Icon>
        Perils Editor
      </Card>
      <Card to="/tools/norwegian-tariff-creator" span={4}>
        <Icon>🛩</Icon>
        Norwegian Price Engine "Gripen"
      </Card>
      <Card to="/tools/campaign-codes" span={4}>
        <Icon>💵</Icon>
        Campaign Codes
      </Card>
      <Card to="/tools/itemizer" span={4}>
        <Icon>📱</Icon>
        Itemizer
      </Card>
    </CardsWrapper>

    {stagingToolsAvailable() && <StagingTools />}
  </FadeIn>
)
