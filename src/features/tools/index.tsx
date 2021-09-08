import styled from '@emotion/styled'
import { CardLink, CardsWrapper } from '@hedvig-ui'
import {
  StagingTools,
  stagingToolsAvailable,
} from 'features/tools/staging-tools'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import React from 'react'

const Icon = styled('div')`
  font-size: 2rem;
  padding-bottom: 1rem;
`

export const Tools: React.FC = () => (
  <FadeIn>
    <CardsWrapper>
      <CardLink to="/tools/charges" span={4}>
        <Icon>💰</Icon>
        Approve Charges
      </CardLink>
      <CardLink to="/tools/switcher-automation" span={4}>
        <Icon>🏡</Icon>
        Switcher Automation
      </CardLink>
      <CardLink to="/tools/perils-editor" span={4}>
        <Icon>📝</Icon>
        Perils Editor
      </CardLink>
      <CardLink to="/tools/norwegian-tariff-creator" span={4}>
        <Icon>🛩</Icon>
        Norwegian Price Engine "Gripen"
      </CardLink>
      <CardLink to="/tools/campaign-codes" span={4}>
        <Icon>💵</Icon>
        Campaign Codes
      </CardLink>
      <CardLink to="/tools/itemizer" span={4}>
        <Icon>📱</Icon>
        Itemizer
      </CardLink>
      <CardLink to="/tools/employees" span={4}>
        <Icon>👩🏼‍🦰</Icon>
        Employees
      </CardLink>
    </CardsWrapper>

    {stagingToolsAvailable() && <StagingTools />}
  </FadeIn>
)
