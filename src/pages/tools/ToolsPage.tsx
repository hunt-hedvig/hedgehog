import styled from '@emotion/styled'
import {
  CardLink,
  CardsWrapper,
  FadeIn,
  HotkeyStyled,
  MainHeadline,
} from '@hedvig-ui'
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useCommandLine } from 'features/commands/command-line-hook'
import React from 'react'
import { useHistory } from 'react-router'

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

const ToolsPage: React.FC = () => {
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
    {
      label: 'Go to Claim Types',
      keys: [Keys.Control, Keys.Seven],
      onResolve: () => {
        history.push('/tools/claim-types')
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
        </Row>

        <Row columns={2}>
          <CardLink to="/tools/campaign-codes" span={4}>
            <Icon>💵</Icon>
            {isControlPressed && <Hotkey dark>5</Hotkey>}
            Campaign Codes
          </CardLink>
          <CardLink to="/tools/employees" span={4}>
            <Icon>👩🏼‍🦰</Icon>
            {isControlPressed && <Hotkey dark>6</Hotkey>}
            Employees
          </CardLink>
          <CardLink to="/tools/claim-types" span={4}>
            <Icon>🧠</Icon>
            {isControlPressed && <Hotkey dark>5</Hotkey>}
            Claim Types
          </CardLink>
        </Row>
      </CardsWrapper>

      {stagingToolsAvailable() && <StagingTools />}
    </FadeIn>
  )
}

export default ToolsPage
