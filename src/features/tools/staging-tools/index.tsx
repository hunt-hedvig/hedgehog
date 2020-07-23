import { CardLink } from 'features/tools'
import { CardsWrapper } from 'hedvig-ui/card'
import { MainHeadline } from 'hedvig-ui/typography'
import React from 'react'
import styled from 'react-emotion'

const Icon = styled('div')`
  font-size: 2rem;
  padding-bottom: 1rem;
`

export const stagingToolsAvailable = () => {
  return (
    process.env.NODE_ENV === 'development' ||
    process.env.API_URL === 'https://backoffice.dev.hedvigit.com/'
  )
}

export const StagingTools: React.FC = () => {
  return (
    <>
      <MainHeadline>Staging specific tools</MainHeadline>
      <CardsWrapper>
        <CardLink to="/tools/unsigner" span={4}>
          <Icon>✍️</Icon>
          Unsign member
        </CardLink>
      </CardsWrapper>
    </>
  )
}
