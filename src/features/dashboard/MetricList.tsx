import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client/core'
import { css, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import { useNavigation } from '@hedvig-ui/hooks/navigation/use-navigation'
import chroma from 'chroma-js'
import { CreateFilterModal } from 'features/claims/claim-templates/CreateFilterModal'
import { FilteredMetric } from 'features/claims/claim-templates/FilteredMetric'
import { useTemplateClaims } from 'features/claims/claim-templates/hooks/use-template-claims'
import { useMe } from 'features/user/hooks/use-me'
import React, { useState } from 'react'
import { Plus } from 'react-bootstrap-icons'
import { useHistory } from 'react-router'
import { Link } from 'react-router-dom'
import { DashboardNumbers, UserSettingKey } from 'types/generated/graphql'

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
    color: ${theme.accentContrast} !important;
  }
`

const Metric = styled(Link)`
  ${({ theme }) => metricStyles(theme)}
`

const AddMetricCard = styled.div`
  transition: none;
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

  border: 2px dotted
    ${({ theme }) =>
      !focus
        ? theme.accent
        : chroma(theme.accent)
            .alpha(0.7)
            .hex()};

  & svg {
    width: 2em;
    height: 2em;
    color: ${({ theme }) => theme.border};
    margin-bottom: 0.5rem;
    transition: none;
  }

  & span {
    font-size: 14px;
  }

  & * {
    color: ${({ theme }) => (!focus ? theme.accent : theme.accentLight)};
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

const GET_DASHBOARD_NUMBERS = gql`
  query GetDashboardNumbers {
    dashboardNumbers {
      numberOfClaims
      numberOfQuestions
    }
  }
`

export const MetricList = () => {
  const history = useHistory()
  const { register } = useNavigation()
  const [createFilter, setCreateFilter] = useState(false)
  const { settings } = useMe()
  const { data: dashboardData } = useQuery(GET_DASHBOARD_NUMBERS, {
    pollInterval: 1000 * 5,
  })

  const dashboardNumbers = dashboardData?.dashboardNumbers as
    | DashboardNumbers
    | undefined

  const {
    templateFilters,
    createTemplate,
    editTemplateWithName,
    removeTemplate,
  } = useTemplateClaims()

  const conversations =
    settings[UserSettingKey.FeatureFlags] &&
    settings[UserSettingKey.FeatureFlags].conversations

  return (
    <>
      <MetricsWrapper>
        <Metric
          to="/claims/list/1"
          {...register('ClaimsMetric', {
            focus: Keys.C,
            resolve: () => history.push('/claims/list/1'),
            neighbors: {
              right: conversations ? 'ConversationsMetric' : 'QuestionsMetric',
            },
          })}
        >
          <MetricNumber>{dashboardNumbers?.numberOfClaims || 0}</MetricNumber>
          <MetricName>claims</MetricName>
        </Metric>
        {conversations ? (
          <Metric
            to="/conversations"
            {...register('ConversationsMetric', {
              resolve: () => history.push('/conversations'),
              neighbors: {
                left: 'ClaimsMetric',
                right: templateFilters.length
                  ? templateFilters[0].name
                  : 'AddMetricCard',
              },
            })}
          >
            <MetricNumber>
              {dashboardNumbers?.numberOfQuestions || 0}
            </MetricNumber>
            <MetricName>conversations</MetricName>
          </Metric>
        ) : (
          <Metric
            to="/questions"
            {...register('QuestionsMetric', {
              resolve: () => history.push('/questions'),
              neighbors: {
                left: 'ClaimsMetric',
                right: templateFilters.length
                  ? templateFilters[0].name
                  : 'AddMetricCard',
              },
            })}
          >
            <MetricNumber>
              {dashboardNumbers?.numberOfQuestions || 0}
            </MetricNumber>
            <MetricName>questions</MetricName>
          </Metric>
        )}

        {templateFilters.map((template, index) => (
          <FilteredMetric
            onCreate={createTemplate}
            onRemove={removeTemplate}
            onEdit={editTemplateWithName}
            key={template.id}
            template={template}
            {...register(template.name, {
              resolve: () =>
                history.push(`/claims/list/1?template=${template.id}`),
              neighbors: {
                left:
                  index !== 0
                    ? templateFilters[index - 1].name
                    : conversations
                    ? 'ConversationsMetric'
                    : 'QuestionsMetric',
                right:
                  index !== templateFilters.length - 1
                    ? templateFilters[index + 1].name
                    : 'AddMetricCard',
              },
            })}
          />
        ))}

        <AddMetricCard
          tabIndex={0}
          onClick={() => setCreateFilter(true)}
          {...register('AddMetricCard', {
            resolve: () => {
              setCreateFilter(true)
              return 'Create'
            },
            neighbors: {
              left: templateFilters.length
                ? templateFilters[templateFilters.length - 1].name
                : conversations
                ? 'ConversationsMetric'
                : 'QuestionsMetric',
            },
          })}
        >
          <Plus />
          <span>Filtered Claim Template</span>
        </AddMetricCard>
      </MetricsWrapper>
      {createFilter && (
        <CreateFilterModal
          onClose={() => setCreateFilter(false)}
          onSave={createTemplate}
        />
      )}
    </>
  )
}
