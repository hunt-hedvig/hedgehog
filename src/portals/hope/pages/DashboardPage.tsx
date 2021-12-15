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
import { useTitle } from '@hedvig-ui/hooks/use-title'
import { changelog } from 'changelog'
import { differenceInCalendarDays, format } from 'date-fns'
import { Greeting } from 'portals/hope/features/dashboard/Greeting'
import { MetricList } from 'portals/hope/features/dashboard/MetricList'
import {
  FocusItems,
  useFocus,
  useNavigation,
} from 'portals/hope/features/navigation/hooks/use-navigation'
import { useMe } from 'portals/hope/features/user/hooks/use-me'
import React from 'react'
import { DashboardNumbers } from 'types/generated/graphql'
import { Page } from 'portals/hope/pages/routes'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
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

  const { me } = useMe()

  const dashboardNumbers = dashboardData?.dashboardNumbers as
    | DashboardNumbers
    | undefined

  useTitle('Dashboard')

  const { focus, setFocus } = useNavigation()

  useFocus(FocusItems.Dashborad.name)

  return (
    <Wrapper>
      <Spacing bottom>
        <Greeting userName={me.fullName.split(' ')[0]} />
      </Spacing>
      {dashboardNumbers && (
        <FadeIn>
          <MetricList
            setFocus={(value: string) => setFocus(value)}
            dashboardNumbers={dashboardNumbers}
            navigationAvailable={focus === FocusItems.Dashborad.name}
          />
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
