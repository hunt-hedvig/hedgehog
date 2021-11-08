import { useQuery } from '@apollo/client'
import { gql } from '@apollo/client/core'
import styled from '@emotion/styled'
import {
  Badge,
  CasualList,
  CasualListItem,
  FadeIn,
  MainHeadline,
  SecondLevelHeadline,
  Spacing,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { useInsecurePersistentState } from '@hedvig-ui/hooks/use-insecure-persistent-state'
import { changelog } from 'changelog'
import { differenceInCalendarDays, format } from 'date-fns'
import { NumberMemberGroupsRadioButtons } from 'features/questions/number-member-groups-radio-buttons'
import { useMe } from 'features/user/hooks/use-me'
import React, { useEffect } from 'react'
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

const getDayPartGreeting = (name: string) => {
  const hours = new Date().getHours()
  if (hours >= 0 && hours < 6) {
    return `Good night ${name}! Shouldn’t you be asleep?`
  } else if (hours >= 6 && hours < 12) {
    return `Good morning ${name}! Have a nice day!`
  } else if (hours >= 12 && hours < 18) {
    return `Good afternoon ${name}!`
  } else if (hours >= 18 && hours <= 23) {
    return `Good evening ${name}!`
  }
}

const GREETINGS = (name: string) => ({
  0: `Hi there, ${name}!`,
  1: `Hello, ${name}!`,
  2: getDayPartGreeting(name),
  3: `Welcome again, ${name}!`,
  4: `How do you do, ${name}?`,
})

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

  const [greetingNum, setGreetingNum] = useInsecurePersistentState<number>(
    'dashboard:greeting',
    0,
  )

  const { settings, me } = useMe()

  const dashboardNumbers = dashboardData?.dashboardNumbers as
    | DashboardNumbers
    | undefined

  useEffect(() => {
    setGreetingNum((prev) => {
      if (prev >= 4) {
        return 0
      }
      return prev + 1
    })
  }, [])

  const getUppercaseName = (email: string) =>
    getLowercaseNameFromEmail(email)
      .charAt(0)
      .toUpperCase() + getLowercaseNameFromEmail(email).slice(1)

  return (
    <Wrapper>
      <Spacing bottom>
        {me && (
          <MainHeadline>
            {GREETINGS(getUppercaseName(me?.email))[greetingNum]}
          </MainHeadline>
        )}
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
    </Wrapper>
  )
}

export const getLowercaseNameFromEmail = (email: string) =>
  email.split(/[^\w]/)[0].toLowerCase()

export default DashboardPage
