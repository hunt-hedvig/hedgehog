import styled from '@emotion/styled'
import {
  CardLink as CardWithLink,
  CardsWrapper,
  FadeIn,
  HotkeyStyled,
  MainHeadline,
} from '@hedvig-ui'
import { useArrowKeyboardNavigation } from '@hedvig-ui/hooks/keyboard/use-arrow-keyboard-navigation'
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useTitle } from '@hedvig-ui/hooks/use-title'
import chroma from 'chroma-js'
import { useCommandLine } from 'features/commands/use-command-line'
import {
  FocusItems,
  useFocus,
  useNavigation,
} from 'features/navigation/hooks/use-navigation'
import React, { useEffect } from 'react'
import { useHistory } from 'react-router'
import { Page } from 'pages/routes'

const Row = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.columns}, 1fr);
`

const Icon = styled('div')`
  font-size: 2rem;
  padding-bottom: 1rem;
`

const Card = styled(CardWithLink)<{ focus?: boolean }>`
  position: relative;

  padding: 2rem;

  ${({ theme, focus }) =>
    focus && `background: ${chroma(theme.accentLight).alpha(0.1).hex()};`}
`

const CardLink = styled(CardWithLink)<{ focus?: boolean }>`
  padding: 2rem;

  ${({ theme, focus }) =>
    focus && `background: ${chroma(theme.accentLight).alpha(0.1).hex()};`}
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

const ToolsPage: Page = () => {
  const history = useHistory()
  const isControlPressed = useKeyIsPressed(Keys.Control)
  const { registerActions } = useCommandLine()

  useTitle('Tools')

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
      keys: [Keys.Control, Keys.Four],
      onResolve: () => {
        history.push('/tools/campaign-codes')
      },
    },
    {
      label: 'Go to Employees',
      keys: [Keys.Control, Keys.Five],
      onResolve: () => {
        history.push('/tools/employees')
      },
    },
    {
      label: 'Go to Claim Types',
      keys: [Keys.Control, Keys.Six],
      onResolve: () => {
        history.push('/tools/claim-types')
      },
    },
  ])

  const paths = [
    '/tools/charges',
    '/tools/switcher-automation',
    '/tools/perils-editor',
    '/tools/campaign-codes',
    '/tools/employees',
    '/tools/claim-types',
  ]

  const { focus } = useNavigation()

  useFocus(FocusItems.Tools.name)

  const [navigationStep, reset] = useArrowKeyboardNavigation({
    maxStep: 4,
    isActive: focus === FocusItems.Tools.name,
    onPerformNavigation: (index) => {
      const currentIndex = index + 1
      history.push(paths[currentIndex])
    },
    direction: 'horizontal',
    withNegative: true,
  })

  useEffect(() => {
    if (focus !== FocusItems.Tools.name) {
      reset()
    }
  }, [focus])

  return (
    <FadeIn>
      <CardsWrapper style={{ flexDirection: 'column' }}>
        <Row columns={3}>
          <Card
            to="/tools/charges"
            span={4}
            focus={focus === FocusItems.Tools.name && navigationStep + 1 === 0}
          >
            <Icon>💰</Icon>
            Approve Charges
            {isControlPressed && <Hotkey dark>1</Hotkey>}
          </Card>
          <Card
            to="/tools/switcher-automation"
            span={4}
            focus={focus === FocusItems.Tools.name && navigationStep + 1 === 1}
          >
            <Icon>🏡</Icon>
            {isControlPressed && <Hotkey dark>2</Hotkey>}
            Switcher Automation
          </Card>
          <Card
            to="/tools/perils-editor"
            span={4}
            focus={focus === FocusItems.Tools.name && navigationStep + 1 === 2}
          >
            <Icon>📝</Icon>
            {isControlPressed && <Hotkey dark>3</Hotkey>}
            Perils Editor
          </Card>
        </Row>

        <Row columns={3}>
          <CardLink
            to="/tools/campaign-codes"
            span={4}
            focus={focus === FocusItems.Tools.name && navigationStep + 1 === 3}
          >
            <Icon>💵</Icon>
            {isControlPressed && <Hotkey dark>4</Hotkey>}
            Campaign Codes
          </CardLink>
          <CardLink
            to="/tools/employees"
            span={4}
            focus={focus === FocusItems.Tools.name && navigationStep + 1 === 4}
          >
            <Icon>👩🏼‍🦰</Icon>
            {isControlPressed && <Hotkey dark>5</Hotkey>}
            Employees
          </CardLink>
          <CardLink
            to="/tools/claim-types"
            span={4}
            focus={focus === FocusItems.Tools.name && navigationStep + 1 === 5}
          >
            <Icon>🧠</Icon>
            {isControlPressed && <Hotkey dark>6</Hotkey>}
            Claim Types
          </CardLink>
        </Row>
      </CardsWrapper>

      {stagingToolsAvailable() && <StagingTools />}
    </FadeIn>
  )
}

export default ToolsPage
