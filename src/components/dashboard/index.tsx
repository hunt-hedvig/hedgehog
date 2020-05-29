import * as sockets from 'lib/sockets'
import PropTypes from 'prop-types'
import React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'
import { history } from 'store'

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

export class Dashboard extends React.Component<any> {
  public state = {
    socket: null,
    subscription: null,
  }

  public static propTypes = {
    setActiveConnection: PropTypes.func.isRequired,
    messages: PropTypes.object.isRequired,
    dashboard: PropTypes.object.isRequired,
    dashboardUpdated: PropTypes.func.isRequired,
    dashboardErrorReceived: PropTypes.func.isRequired,
    updatesRequestSuccess: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
  }

  public subscribeSocket = (connection) => {
    const {
      dashboardUpdated,
      dashboardErrorReceived,
      updatesRequestSuccess,
      auth: { email },
    } = this.props
    const { stompClient, subscription } = sockets.dashboardSubscribe(
      { dashboardUpdated, dashboardErrorReceived, updatesRequestSuccess },
      email,
      connection,
    )
    this.setState({
      socket: stompClient,
      subscription,
    })
  }

  public redirect = (route) => {
    history.push(route)
  }

  public socketConnect = (setActiveConnection) => {
    sockets.connect().then((stompClient) => {
      setActiveConnection(stompClient)
      this.subscribeSocket(stompClient)
    })
  }

  public componentDidMount() {
    const {
      setActiveConnection,
      messages: { activeConnection },
    } = this.props
    if (activeConnection) {
      this.subscribeSocket(activeConnection)
    } else {
      this.socketConnect(setActiveConnection)
    }
  }

  public componentWillUnmount() {
    sockets.disconnect(null, this.state.subscription)
  }

  public render() {
    const claims = this.props.dashboard?.data?.CLAIMS
    const questions = this.props.dashboard?.data?.QUESTIONS
    return (
      <MetricsWrapper>
        <Metric to="/claims">
          <MetricNumber>{claims || 0}</MetricNumber>
          <MetricName>claims</MetricName>
        </Metric>
        <Metric to="/questions">
          <MetricNumber>{questions || 0}</MetricNumber>
          <MetricName>questions</MetricName>
        </Metric>
      </MetricsWrapper>
    )
  }
}
