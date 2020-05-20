import { Card, CardsWrapper } from 'hedvig-ui/card'
import * as React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

const Icon = styled('div')`
  font-size: 2rem;
  padding-bottom: 1rem;
`

const CardLink = Card.withComponent(Link)

export const Tools: React.FC = () => (
  <CardsWrapper>
    <CardLink to="/tools/charges" span={4}>
      <Icon>💰</Icon>
      Approve charges
    </CardLink>

    <CardLink to="/tools/switcher-automation" span={4}>
      <Icon>🏡</Icon>
      Switcher automation
    </CardLink>

    <CardLink to="/tools/perils-editor" span={4}>
      <Icon>📝</Icon>
      Perils editor
    </CardLink>

    <CardLink to="/tools/norwegian-tariff-creator" span={4}>
      <Icon>🛩</Icon>
      Norwegian Price Engine "Gripen"
    </CardLink>

    <CardLink to="/tools/campaign-codes" span={4}>
      <Icon>💵</Icon>
      Campaign Codes
    </CardLink>
  </CardsWrapper>
)
