import styled from '@emotion/styled'
import { CardLink, CardsWrapper, FadeIn, MainHeadline } from '@hedvig-ui'
import { useTitle } from '@hedvig-ui/hooks/use-title'
import React from 'react'
import { useHistory } from 'react-router'
import { useNavigation } from '@hedvig-ui/hooks/navigation/use-navigation'

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
  padding: 2rem;
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
  useTitle('Tools')

  const { register } = useNavigation()
  const history = useHistory()

  return (
    <FadeIn>
      <CardsWrapper style={{ flexDirection: 'column' }}>
        <Row columns={3}>
          <Card
            to="/tools/charges"
            span={4}
            {...register('ApproveCharges', {
              autoFocus: true,
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
            Claim Types
          </Card>
        </Row>
      </CardsWrapper>

      {stagingToolsAvailable() && <StagingTools />}
    </FadeIn>
  )
}

export default ToolsPage
