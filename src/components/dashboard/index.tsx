import { useDashboardNumbers } from 'graphql/use-dashboard-numbers'
import { MainHeadline } from 'hedvig-ui/typography'
import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'

const Headline = styled(MainHeadline)({
  marginBottom: '2rem',
})
const MetricsWrapper = styled('div')({
  display: 'flex',
})
const Metric = styled(Link)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  color: theme.accentContrast + ' !important',
  background: theme.accent,
  padding: '1.5rem',
  borderRadius: '0.5rem',
  marginRight: '1rem',
  minWidth: 200,
  '&:hover, &focus': {
    color: theme.accentContrast + ' !important',
  },
}))
const MetricNumber = styled('span')(() => ({
  display: 'block',
  fontSize: '2rem',
  paddingBottom: '0.25rem',
}))
const MetricName = styled('span')({
  opacity: 0.66,
})

export const Dashboard: React.FC<{ auth: any }> = ({ auth }) => {
  const [dashboardNumbers] = useDashboardNumbers()

  return (
    <>
      <Headline>
        Hi there{' '}
        <span css={{ textTransform: 'capitalize' }}>
          {auth?.email && getLowercaseNameFromEmail(auth.email)}
        </span>
        !
      </Headline>
      {dashboardNumbers && (
        <MetricsWrapper>
          <Metric to="/claims">
            <MetricNumber>{dashboardNumbers?.numberOfClaims || 0}</MetricNumber>
            <MetricName>claims</MetricName>
          </Metric>
          <Metric to="/questions">
            <MetricNumber>
              {dashboardNumbers?.numberOfQuestions || 0}
            </MetricNumber>
            <MetricName>questions</MetricName>
          </Metric>
        </MetricsWrapper>
      )}
    </>
  )
}

const getLowercaseNameFromEmail = (email: string) =>
  email.split(/[^\w]/)[0].toLowerCase()
