import { changelog } from 'changelog'
import { NumberMemberGroupsRadioButtons } from 'components/questions/number-member-groups-radio-buttons'
import { differenceInCalendarDays, format } from 'date-fns'
import { useDashboardNumbers } from 'graphql/use-dashboard-numbers'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import { Badge } from 'hedvig-ui/badge'
import { CasualList, CasualListItem } from 'hedvig-ui/casual-list'
import { Spacing } from 'hedvig-ui/spacing'
import {
  MainHeadline,
  SecondLevelHeadline,
  ThirdLevelHeadline,
} from 'hedvig-ui/typography'
import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

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

export const Dashboard: React.FC<{ auth: any }> = ({ auth }) => {
  const [dashboardNumbers] = useDashboardNumbers()

  return (
    <Wrapper>
      <Spacing bottom>
        <MainHeadline>
          Hi there{' '}
          <span css={{ textTransform: 'capitalize' }}>
            {auth?.email && getLowercaseNameFromEmail(auth.email)}
          </span>
          !
        </MainHeadline>
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
            <Metric to="/questions">
              <MetricNumber>
                {dashboardNumbers?.numberOfQuestions || 0}
              </MetricNumber>
              <MetricName>questions</MetricName>
            </Metric>
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
              <FadeIn delay={`${index * 50}ms`}>
                <ChangeLogItem key={change.change}>
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

const getLowercaseNameFromEmail = (email: string) =>
  email.split(/[^\w]/)[0].toLowerCase()
