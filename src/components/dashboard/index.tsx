import { colors } from '@hedviginsurance/brand'
import * as sockets from 'lib/sockets'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import styled from 'react-emotion'
import { Link } from 'react-router-dom'
import { history } from 'store'

const Metric = styled('div')({
  display: 'flex',
  alignItems: 'center',
  fontSize: 32,
  paddingBottom: 16,
})
const MetricNumber = styled('div')(
  ({ backgroundColor }: { backgroundColor: string }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    width: 64,
    height: 64,
    borderRadius: 64,
    backgroundColor,
    a: {
      color: '#fff',
      '&:hover, &:focus': {
        color: '#fff',
      },
    },
  }),
)

export class Dashboard extends React.Component<any> {
  public state = {
    socket: null,
    subscription: null,
  }

  public propTypes = {
    authLogOut: PropTypes.func.isRequired,
    setActiveConnection: PropTypes.func.isRequired,
    messages: PropTypes.object.isRequired,
    dashboard: PropTypes.object.isRequired,
    dashboardUpdated: PropTypes.func.isRequired,
    dashboardErrorReceived: PropTypes.func.isRequired,
    updatesRequestSuccess: PropTypes.func.isRequired,
    client: PropTypes.object.isRequired,
  }

  public subscribeSocket = (connection) => {
    const {
      dashboardUpdated,
      dashboardErrorReceived,
      updatesRequestSuccess,
      client: { id },
    } = this.props
    const { stompClient, subscription } = sockets.dashboardSubscribe(
      { dashboardUpdated, dashboardErrorReceived, updatesRequestSuccess },
      id,
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
    const claims =
      this.props.dashboard &&
      this.props.dashboard.data &&
      this.props.dashboard.data.CLAIMS
    const questions =
      this.props.dashboard &&
      this.props.dashboard.data &&
      this.props.dashboard.data.QUESTIONS
    return (
      <div>
        <Metric>
          <Link to="/claims">Claims:</Link>
          <MetricNumber backgroundColor={colors.PINK}>
            <Link to="/claims">{claims || 0}</Link>
          </MetricNumber>
        </Metric>
        <Metric>
          <Link to="/questions">Questions:</Link>{' '}
          <MetricNumber backgroundColor={colors.PURPLE}>
            <Link to="/questions">{questions || 0}</Link>
          </MetricNumber>
        </Metric>
      </div>
    )
  }
}
