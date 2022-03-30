import { useQuery } from '@apollo/client'
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
import { Greeting } from 'portals/hope/features/dashboard/Greeting'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import React, { useState } from 'react'
import { DashboardNumbers } from 'types/generated/graphql'
import { Page } from 'portals/hope/pages/routes'
import gql from 'graphql-tag'
import { Link } from 'react-router-dom'
import { useTemplateClaims } from 'portals/hope/features/claims/claim-templates/hooks/use-template-claims'
import { FilteredMetric } from 'portals/hope/features/claims/claim-templates/FilteredMetric'
import { Plus } from 'react-bootstrap-icons'
import { CreateFilterModal } from 'portals/hope/features/claims/claim-templates/CreateFilterModal'
import { useNavigation } from '@hedvig-ui/hooks/navigation/use-navigation'
import { useHistory } from 'react-router'

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

const DashboardPage: Page = () => {
  const { data: dashboardData } = useQuery(GET_DASHBOARD_NUMBERS, {
    pollInterval: 1000 * 5,
  })
  const [createFilter, setCreateFilter] = useState(false)

  const { settings, me } = useMe()

  const dashboardNumbers = dashboardData?.dashboardNumbers as
    | DashboardNumbers
    | undefined

  useTitle('Dashboard')

  const history = useHistory()
  const { register } = useNavigation()

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
      <FadeIn>
        <MetricsWrapper>
          <Metric
            to="/claims/list/1"
            {...register('ClaimsMetric', {
              autoFocus: true,
              resolve: () => {
                history.push('/claims/list/1')
              },
              neighbors: {
                right: settings.featureFlags?.conversations
                  ? 'ConversationsMetric'
                  : 'QuestionsMetric',
              },
            })}
          >
            <MetricNumber>{dashboardNumbers?.numberOfClaims || 0}</MetricNumber>
            <MetricName>claims</MetricName>
          </Metric>
          {settings.featureFlags?.conversations ? (
            <Metric
              to="/conversations"
              {...register('ConversationsMetric', {
                resolve: () => {
                  history.push('/conversations')
                },
                neighbors: {
                  left: 'ClaimsMetric',
                  right: templateFilters.length
                    ? templateFilters[0].name
                    : 'Add Template',
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
                resolve: () => {
                  history.push('/questions')
                },
                neighbors: {
                  left: 'ClaimsMetric',
                  right: templateFilters.length
                    ? templateFilters[0].name
                    : 'Add Template',
                },
              })}
            >
              <MetricNumber>
                {dashboardNumbers?.numberOfQuestions || 0}
              </MetricNumber>
              <MetricName>questions</MetricName>
            </Metric>
          )}

          {templateFilters.map((template, index) => {
            const registeredTemplate = register(template.name, {
              resolve: () => {
                history.push(`/claims/list/1?template=${template.id}`)
              },
              neighbors: {
                left: index
                  ? templateFilters[index - 1].name
                  : settings.featureFlags?.conversations
                  ? 'ConversationsMetric'
                  : 'QuestionsMetric',
                right:
                  index < templateFilters.length - 1
                    ? templateFilters[index + 1].name
                    : 'Add Template',
              },
            })

            return (
              <FilteredMetric
                onCreate={createTemplate}
                onRemove={removeTemplate}
                onEdit={editTemplateWithName}
                key={template.id}
                template={template}
                style={{
                  ...registeredTemplate.style,
                }}
              />
            )
          })}

          <AddMetricCard
            {...register('Add Template', {
              resolve: () => {
                setCreateFilter(true)
              },
              neighbors: {
                left: templateFilters.length
                  ? templateFilters[templateFilters.length - 1].name
                  : settings.featureFlags?.conversations
                  ? 'ConversationsMetric'
                  : 'QuestionsMetric',
              },
            })}
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
      <CreateFilterModal
        onClose={() => setCreateFilter(false)}
        onSave={createTemplate}
        visible={createFilter}
      />
    </Wrapper>
  )
}

export default DashboardPage
