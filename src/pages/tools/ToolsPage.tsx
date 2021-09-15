import styled from '@emotion/styled'
import { CardLink, CardsWrapper, FadeIn, MainHeadline } from '@hedvig-ui'

import React from 'react'

const Row = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.columns}, 1fr);
`

const Icon = styled('div')`
  font-size: 2rem;
  padding-bottom: 1rem;
`

const stagingToolsAvailable = () => {
  return (window as any).HOPE_FEATURES?.stagingSpecificTools ?? false
}

const StagingTools: React.FC = () => {
  return (
    <>
      <MainHeadline>Staging specific tools</MainHeadline>
      <CardsWrapper>
        <CardLink to="/tools/unsign-member" span={4}>
          <Icon>✍️</Icon>
          Unsign member
        </CardLink>
      </CardsWrapper>
    </>
  )
}

export const ToolsPage: React.FC = () => (
  <FadeIn>
    <CardsWrapper style={{ flexDirection: 'column' }}>
      <Row columns={4}>
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
      </Row>

      <Row columns={2}>
        <CardLink to="/tools/campaign-codes" span={4}>
          <Icon>💵</Icon>
          Campaign Codes
        </CardLink>
        <CardLink to="/tools/employees" span={4}>
          <Icon>👩🏼‍🦰</Icon>
          Employees
        </CardLink>
      </Row>
    </CardsWrapper>

    {stagingToolsAvailable() && <StagingTools />}
  </FadeIn>
)
