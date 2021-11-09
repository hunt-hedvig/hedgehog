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
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import { changelog } from 'changelog'
import { differenceInCalendarDays, format } from 'date-fns'
import { Greeting } from 'features/dashboard/Greeting'
import { NumberMemberGroupsRadioButtons } from 'features/questions/number-member-groups-radio-buttons'
import { useMe } from 'features/user/hooks/use-me'
import React, { useState } from 'react'
import { Plus } from 'react-bootstrap-icons'
import { Link } from 'react-router-dom'
import { DashboardNumbers, UserSettingKey } from 'types/generated/graphql'
import { ClaimsFiltersType } from '../claims/list/ClaimsListPage'
import CreateFilterForm from './CreateFilterForm'
import FilteredMetric from './FilteredMetric'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const MetricsWrapper = styled.div({
  display: 'flex',
})

export const metricStyles = (theme: Theme) => css`
  display: flex;
  flex-direction: column;
  color: ${theme.accentContrast} !important;
  background: ${theme.accent};
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-right: 1rem;
  min-width: 200px;

  &:hover,
  &focus {
    color: ${theme.accentContrast}!important;
  }
`

const Metric = styled(Link)`
  ${({ theme }) => metricStyles(theme)}
`

const AddMetric = styled.div`
  ${({ theme }) => metricStyles(theme)}
  transition: all 0.3s;
  background-color: transparent;
  border: 2px dotted ${({ theme }) => theme.border};
  align-items: center;
  cursor: pointer;
  outline: none;

  & svg {
    width: 2em;
    height: 2em;
    color: ${({ theme }) => theme.border};
    transition: none;
  }

  & span {
    color: ${({ theme }) => theme.accentLight};
  }

  &:hover,
  &:focus {
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

export interface ClaimsFiltersTypeWithName extends ClaimsFiltersType {
  name?: string
}

interface TemplateFiltersType {
  filters: ClaimsFiltersTypeWithName[] | []
}

const DashboardPage: React.FC = () => {
  const { data: dashboardData } = useQuery(GET_DASHBOARD_NUMBERS, {
    pollInterval: 1000 * 5,
  })
  const [createFilter, setCreateFilter] = useState(false)
  const [templateFilters, setTemplateFilters] = useInsecurePersistentState<
    TemplateFiltersType
  >('claims:template-filters', {
    filters: [],
  })

  const { settings, me } = useMe()

  const dashboardNumbers = dashboardData?.dashboardNumbers as
    | DashboardNumbers
    | undefined

  const setTemplateFilterHandler = (_: number, filter: ClaimsFiltersType) => {
    setTemplateFilters((prev) => ({
      filters: [...prev.filters, { ...filter }],
    }))
  }

  const editTemplateFilterHandler = (id: number, filter: ClaimsFiltersType) => {
    console.log(id, filter)
  }

  const removeTemplateFilterHandler = (id: number) => {
    const newFilters = templateFilters.filters.filter(
      (_, index) => index !== id,
    )
    console.log(newFilters)
    setTemplateFilters({
      filters: newFilters,
    })
  }

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
            {settings[UserSettingKey.FeatureFlags]?.conversations ? (
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

            {templateFilters.filters.map((filter, index) => (
              <FilteredMetric
                removeFilter={removeTemplateFilterHandler}
                key={index + templateFilters.filters.length}
                id={index}
                filter={filter}
                editFilterHandler={editTemplateFilterHandler}
              />
            ))}

            <AddMetric tabIndex={0} onClick={() => setCreateFilter(true)}>
              <Plus />
              <MetricName>Add Filtered Claims</MetricName>
            </AddMetric>
          </MetricsWrapper>
        </FadeIn>
      )}
      <Spacing top bottom>
        <ThirdLevelHeadline>
          <strong>Number of member groups:</strong>
        </ThirdLevelHeadline>
        <NumberMemberGroupsRadioButtons />
      </Spacing>
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
        <CreateFilterForm
          close={() => setCreateFilter(false)}
          createFilter={setTemplateFilterHandler}
          id={templateFilters.filters.length}
        />
      )}
    </Wrapper>
  )
}

export default DashboardPage
