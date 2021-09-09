import styled from '@emotion/styled'
import { CardLink, CardsWrapper, MainHeadline } from '@hedvig-ui'
import React from 'react'

const Icon = styled('div')`
  font-size: 2rem;
  padding-bottom: 1rem;
`

export const stagingToolsAvailable = () => {
  return (window as any).HOPE_FEATURES?.stagingSpecificTools ?? false
}

export const StagingTools: React.FC = () => {
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
