import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client/core'
import styled from '@emotion/styled'
import {
  Badge,
  CasualList,
  CasualListItem,
  FadeIn,
  SecondLevelHeadline,
  Spacing,
} from '@hedvig-ui'
import { changelog } from 'changelog'
import { differenceInCalendarDays, format } from 'date-fns'
import { Greeting } from 'features/dashboard/Greeting'
import { useMe } from 'features/user/hooks/use-me'
import React, { useEffect } from 'react'
import { hotjar } from 'react-hotjar'
import { Link } from 'react-router-dom'
import { DashboardNumbers, UserSettingKey } from 'types/generated/graphql'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const MetricsWrapper = styled.div({
  display: 'flex',
})
const Metric = styled(Link)`
  display: flex;
  flex-direction: column;
  color: ${({ theme }) => theme.accentContrast} !important;
  background: ${({ theme }) => theme.accent};
  padding: 1.5rem;
  border-radius: 0.5rem;
  margin-right: 1rem;
  min-width: 200px;
  &:hover,
  &focus {
    color: ${({ theme }) => theme.accentContrast}!important;
  }
`

const MetricNumber = styled.span`
  display: block;
  font-size: 2rem;
  padding-bottom: 0.25rem;
`
const MetricName = styled.span`
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

  useEffect(() => {
    hotjar.initialize(2692591, 6)
  }, [])

  const { settings, me } = useMe()

  const dashboardNumbers = dashboardData?.dashboardNumbers as
    | DashboardNumbers
    | undefined

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
    </Wrapper>
  )
}

export default DashboardPage
