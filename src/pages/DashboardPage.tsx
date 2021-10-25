import styled from '@emotion/styled'
import {
  Badge,
  Capitalized,
  CasualList,
  CasualListItem,
  FadeIn,
  MainHeadline,
  SecondLevelHeadline,
  Spacing,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { changelog } from 'changelog'
import { differenceInCalendarDays, format } from 'date-fns'
import { NumberMemberGroupsRadioButtons } from 'features/questions/number-member-groups-radio-buttons'
import { useDashboardNumbers } from 'graphql/use-dashboard-numbers'
import React from 'react'
import { Link } from 'react-router-dom'
import { useGetMeQuery } from 'types/generated/graphql'
import { useInsecurePersistentState } from 'utils/state'

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

const DashboardPage: React.FC = () => {
  const { data } = useGetMeQuery()
  const [dashboardNumbers] = useDashboardNumbers()
  const [conversationsEnabled] = useInsecurePersistentState<boolean>(
    'conversations:enabled',
    false,
  )

  return (
    <Wrapper>
      <Spacing bottom>
        {data?.me && (
          <MainHeadline>
            Hi there{' '}
            <Capitalized>
              {getLowercaseNameFromEmail(data?.me.user.email)}
            </Capitalized>
            !
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
            {conversationsEnabled ? (
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
