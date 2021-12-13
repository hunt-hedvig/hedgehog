import styled from '@emotion/styled'
import {
  CardLink as CardWithLink,
  CardsWrapper,
  FadeIn,
  HotkeyStyled,
  MainHeadline,
} from '@hedvig-ui'
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useNavigation } from '@hedvig-ui/hooks/navigation/use-navigation'
import { useTitle } from '@hedvig-ui/hooks/use-title'
import chroma from 'chroma-js'
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

const Card = styled(CardWithLink)`
  position: relative;

  padding: 2rem;

  ${({ theme, focus }) =>
    focus &&
    `background: ${chroma(theme.accentLight)
      .alpha(0.1)
      .hex()};`}
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
  const history = useHistory()
  const { register } = useNavigation()
  return (
    <>
      <MainHeadline>Staging specific tools</MainHeadline>
      <CardsWrapper>
        <Card
          to="/tools/unsign-member"
          span={4}
          {...register('UnsignMember', {
            resolve: () => {
              history.push('/tools/unsign-member')
            },
            neighbors: {
              up: 'CampaignCodes',
            },
          })}
        >
          <Icon>✍️</Icon>
          Unsign member
        </Card>
      </CardsWrapper>
    </>
  )
}

const ToolsPage: React.FC = () => {
  const { register } = useNavigation()
  const history = useHistory()
  const isControlPressed = useKeyIsPressed(Keys.Control)

  useTitle('Tools')

  return (
    <FadeIn>
      <CardsWrapper style={{ flexDirection: 'column' }}>
        <Row columns={3}>
          <Card
            to="/tools/charges"
            span={4}
            {...register('ApproveCharges', {
              focusOnMount: true,
              focus: Keys.T,
              resolve: () => {
                history.push('/tools/charges')
              },
              neighbors: {
                right: 'SwitcherAutomation',
                down: 'CampaignCodes',
              },
            })}
          >
            <Icon>💰</Icon>
            Approve Charges
            {isControlPressed && <Hotkey dark>1</Hotkey>}
          </Card>
          <Card
            to="/tools/switcher-automation"
            span={4}
            {...register('SwitcherAutomation', {
              resolve: () => {
                history.push('/tools/switcher-automation')
              },
              neighbors: {
                left: 'ApproveCharges',
                right: 'PerilsEditor',
                down: 'Employees',
              },
            })}
          >
            <Icon>🏡</Icon>
            {isControlPressed && <Hotkey dark>2</Hotkey>}
            Switcher Automation
          </Card>
          <Card
            to="/tools/perils-editor"
            span={4}
            {...register('PerilsEditor', {
              resolve: () => {
                history.push('/tools/perils-editor')
              },
              neighbors: {
                left: 'SwitcherAutomation',
                down: 'ClaimTypes',
              },
            })}
          >
            <Icon>📝</Icon>
            {isControlPressed && <Hotkey dark>3</Hotkey>}
            Perils Editor
          </Card>
        </Row>

        <Row columns={3}>
          <Card
            to="/tools/campaign-codes"
            span={4}
            {...register('CampaignCodes', {
              resolve: () => {
                history.push('/tools/campaign-codes')
              },
              neighbors: {
                up: 'ApproveCharges',
                right: 'Employees',
                down: 'UnsignMember',
              },
            })}
          >
            <Icon>💵</Icon>
            {isControlPressed && <Hotkey dark>4</Hotkey>}
            Campaign Codes
          </Card>
          <Card
            to="/tools/employees"
            span={4}
            {...register('Employees', {
              resolve: () => {
                history.push('/tools/employees')
              },
              neighbors: {
                up: 'SwitcherAutomation',
                right: 'ClaimTypes',
                left: 'CampaignCodes',
                down: 'UnsignMember',
              },
            })}
          >
            <Icon>👩🏼‍🦰</Icon>
            {isControlPressed && <Hotkey dark>5</Hotkey>}
            Employees
          </Card>
          <Card
            to="/tools/claim-types"
            span={4}
            {...register('ClaimTypes', {
              resolve: () => {
                history.push('/tools/claim-types')
              },
              neighbors: {
                up: 'PerilsEditor',
                left: 'Employees',
                down: 'UnsignMember',
              },
            })}
          >
            <Icon>🧠</Icon>
            {isControlPressed && <Hotkey dark>6</Hotkey>}
            Claim Types
          </Card>
        </Row>
      </CardsWrapper>

      {stagingToolsAvailable() && <StagingTools />}
    </FadeIn>
  )
}

export default ToolsPage
