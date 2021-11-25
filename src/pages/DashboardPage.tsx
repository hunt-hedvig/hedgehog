import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client/core'
import { css, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import {
  Badge,
  CasualList,
  CasualListItem,
  FadeIn,
  SecondLevelHeadline,
  Spacing,
} from '@hedvig-ui'
import { isPressing, Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useTitle } from '@hedvig-ui/hooks/use-title'
import { changelog } from 'changelog'
import { differenceInCalendarDays, format } from 'date-fns'
import { CreateFilterModal } from 'features/claims/claim-templates/CreateFilterModal'
import { FilteredMetric } from 'features/claims/claim-templates/FilteredMetric'
import { useTemplateClaims } from 'features/claims/claim-templates/hooks/use-template-claims'
import { Greeting } from 'features/dashboard/Greeting'
import { useMe } from 'features/user/hooks/use-me'
import React, { useState } from 'react'
import { Plus } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'
import { DashboardNumbers, UserSettingKey } from 'types/generated/graphql'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const MetricsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
`

export const metricStyles = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  color: ${theme.accentContrast} !important;
  background: ${theme.accent};
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  min-width: 200px;

  &:hover,
  &:focus {
    opacity: 0.8;
    color: ${theme.accentContrast}!important;
  }
`

const Metric = styled(Link)`
  ${({ theme }) => metricStyles(theme)}
`

const AddMetricCard = styled.div`
  min-height: 111.5px;
  width: 200px;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;

  outline: none;
  border-radius: 0.5rem;
  margin-right: 1rem;
  margin-bottom: 1rem;
  padding: 15px 0;

  border: 2px dotted ${({ theme }) => theme.border};

  & svg {
    width: 2em;
    height: 2em;
    color: ${({ theme }) => theme.border};
    margin-bottom: 0.5rem;
    transition: none;
  }

  & span {
    font-size: 14px;
    color: ${({ theme }) => theme.accentLight};
  }

  &:hover,
  &:focus {
    cursor: pointer;
    border-color: ${({ theme }) => theme.accent};

    & svg,
    & span {
      color: ${({ theme }) => theme.accent};
    }
  }
`

export const MetricNumber = styled.span`
  display: block;
  font-size: 2rem;
  padding-bottom: 0.25rem;
`
export const MetricName = styled.span`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: 0.66;
`

const ChangeLogWrapper = styled(CasualList)`
  max-width: 800px;
`
const ChangeLogItem = CasualListItem
const ChangeDescription = styled.div``
const MutedText = styled.div`
  color: ${({ theme }) => theme.placeholderColor};
  font-size: 0.9rem;
`

const GET_DASHBOARD_NUMBERS = gql`
  query GetDashboardNumbers {
    dashboardNumbers {
      numberOfClaims
      numberOfQuestions
    }
  }
`

const DashboardPage: React.FC = () => {
  const { data: dashboardData } = useQuery(GET_DASHBOARD_NUMBERS, {
    pollInterval: 1000 * 5,
  })
  const [createFilter, setCreateFilter] = useState(false)

  const { settings, me } = useMe()

  const dashboardNumbers = dashboardData?.dashboardNumbers as
    | DashboardNumbers
    | undefined

  useTitle('Dashboard')

  const {
    templateFilters,
    createTemplate,
    editTemplateWithName,
    removeTemplate,
  } = useTemplateClaims()

  return (
    <Wrapper>
      <Spacing bottom>
        <Greeting userName={me.fullName.split(' ')[0]} />
      </Spacing>
      {dashboardNumbers && (
        <FadeIn>
          <MetricsWrapper>
            <Metric to="/claims/list/1">
              <MetricNumber>
                {dashboardNumbers?.numberOfClaims || 0}
              </MetricNumber>
              <MetricName>claims</MetricName>
            </Metric>
            {settings[UserSettingKey.FeatureFlags] &&
            settings[UserSettingKey.FeatureFlags]?.conversations ? (
              <Metric to="/conversations">
                <MetricNumber>
                  {dashboardNumbers?.numberOfQuestions || 0}
                </MetricNumber>
                <MetricName>conversations</MetricName>
              </Metric>
            ) : (
              <Metric to="/questions">
                <MetricNumber>
                  {dashboardNumbers?.numberOfQuestions || 0}
                </MetricNumber>
                <MetricName>questions</MetricName>
              </Metric>
            )}

            {templateFilters.map((filter, index) => (
              <FilteredMetric
                onCreate={createTemplate}
                onRemove={removeTemplate}
                onEdit={editTemplateWithName}
                key={index + templateFilters.length}
                filter={filter}
              />
            ))}

            <AddMetricCard
              tabIndex={0}
              onClick={() => setCreateFilter(true)}
              onKeyDown={(e) => {
                if (isPressing(e, Keys.Enter)) {
                  setCreateFilter(true)
                }
              }}
            >
              <Plus />
              <span>Filtered Claim Template</span>
            </AddMetricCard>
          </MetricsWrapper>
        </FadeIn>
      )}
      <Spacing top="large">
        <SecondLevelHeadline>Recent changes from Tech</SecondLevelHeadline>
        <Spacing bottom>
          <MutedText>
            If you experience any issues with new updates, please submit a bug
            to the{' '}
            <a href="slack://channel?id=CT97ADLGJ&team=T5KLK1H52">#bug-inbox</a>{' '}
            Slack channel
          </MutedText>
        </Spacing>
        <ChangeLogWrapper>
          {changelog.slice(0, 10).map((change, index) => {
            const isRecent =
              differenceInCalendarDays(new Date(), change.date) < 3
            return (
              <FadeIn delay={`${index * 50}ms`} key={change.change}>
                <ChangeLogItem>
                  <ChangeDescription>
                    {change.change}
                    {isRecent && (
                      <Spacing inline left="small" width="auto">
                        <Badge variant="success" size="small" matchParentSize>
                          New!
                        </Badge>
                      </Spacing>
                    )}
                  </ChangeDescription>
                  <MutedText>
                    {format(change.date, 'iii MMM do')}
                    {change.authorGithubHandle &&
                      ` by ${change.authorGithubHandle}`}
                  </MutedText>
                </ChangeLogItem>
              </FadeIn>
            )
          })}
        </ChangeLogWrapper>
      </Spacing>
      {createFilter && (
        <CreateFilterModal
          onClose={() => setCreateFilter(false)}
          onSave={createTemplate}
        />
      )}
    </Wrapper>
  )
}

export default DashboardPage
