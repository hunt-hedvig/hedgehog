import styled from '@emotion/styled'
import {
  CardLink,
  CardsWrapper,
  FadeIn,
  HotkeyStyled,
  MainHeadline,
} from '@hedvig-ui'
import React from 'react'
import { useHistory } from 'react-router'
import { useCommandLine } from 'utils/hooks/command-line-hook'
import { Keys, useKeyIsPressed } from 'utils/hooks/key-press-hook'

const Row = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.columns}, 1fr);
`

const Icon = styled('div')`
  font-size: 2rem;
  padding-bottom: 1rem;
`

const Card = styled(CardLink)`
  position: relative;
`

const Hotkey = styled(HotkeyStyled)`
  right: 1em;
  top: 1em;
  padding: 2px 10px;
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

export const ToolsPage: React.FC = () => {
  const history = useHistory()
  const isControlPressed = useKeyIsPressed(Keys.Control)
  const { registerActions } = useCommandLine()

  registerActions([
    {
      label: 'Go to Approve Charges',
      keys: [Keys.Control, Keys.One],
      onResolve: () => {
        history.push('/tools/charges')
      },
    },
    {
      label: 'Go to Switcher Automation',
      keys: [Keys.Control, Keys.Two],
      onResolve: () => {
        history.push('/tools/switcher-automation')
      },
    },
    {
      label: 'Go to Perils Editor',
      keys: [Keys.Control, Keys.Three],
      onResolve: () => {
        history.push('/tools/perils-editor')
      },
    },
    {
      label: 'Go to Norwegian Price Engine "Gripen"',
      keys: [Keys.Control, Keys.Four],
      onResolve: () => {
        history.push('/tools/norwegian-tariff-creator')
      },
    },
    {
      label: 'Go to Campaign Codes',
      keys: [Keys.Control, Keys.Five],
      onResolve: () => {
        history.push('/tools/campaign-codes')
      },
    },
    {
      label: 'Go to Employees',
      keys: [Keys.Control, Keys.Six],
      onResolve: () => {
        history.push('/tools/employees')
      },
    },
  ])

  return (
    <FadeIn>
      <CardsWrapper style={{ flexDirection: 'column' }}>
        <Row columns={4}>
          <Card to="/tools/charges" span={4}>
            <Icon>💰</Icon>
            Approve Charges
            {isControlPressed && <Hotkey dark>1</Hotkey>}
          </Card>
          <Card to="/tools/switcher-automation" span={4}>
            <Icon>🏡</Icon>
            {isControlPressed && <Hotkey dark>2</Hotkey>}
            Switcher Automation
          </Card>
          <Card to="/tools/perils-editor" span={4}>
            <Icon>📝</Icon>
            {isControlPressed && <Hotkey dark>3</Hotkey>}
            Perils Editor
          </Card>
          <Card to="/tools/norwegian-tariff-creator" span={4}>
            <Icon>🛩</Icon>
            {isControlPressed && <Hotkey dark>4</Hotkey>}
            Norwegian Price Engine "Gripen"
          </Card>
        </Row>

        <Row columns={2}>
          <Card to="/tools/campaign-codes" span={4}>
            <Icon>💵</Icon>
            {isControlPressed && <Hotkey dark>5</Hotkey>}
            Campaign Codes
          </Card>
          <Card to="/tools/employees" span={4}>
            <Icon>👩🏼‍🦰</Icon>
            {isControlPressed && <Hotkey dark>6</Hotkey>}
            Employees
          </Card>
        </Row>
      </CardsWrapper>

      {stagingToolsAvailable() && <StagingTools />}
    </FadeIn>
  )
}
