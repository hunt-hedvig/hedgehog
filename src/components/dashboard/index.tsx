import { ItemContent } from 'components/shared'
import { routesList } from 'lib/selectOptions'
import * as sockets from 'lib/sockets'
import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Label, List } from 'semantic-ui-react'
import { history } from 'store'
import styled from 'styled-components'

const DashboardContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 70%;
`

const ListContainer = styled.div`
  width: 300px;
`

const LinkName = styled.span`
  font-family: Lato, 'Helvetica Neue', Arial, Helvetica, sans-serif;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.87);
`

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: null,
      subscription: null,
    }
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

  public getItemContent = (item) => {
    const {
      dashboard: { data },
    } = this.props

    return (
      <ItemContent>
        <LinkName>{item.text}</LinkName>
        {data && data[item.type] ? (
          <Label color="blue" horizontal circular>
            {data[item.type]}
          </Label>
        ) : null}
      </ItemContent>
    )
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
    const { unsetClient, client } = this.props
    return client.id ? (
      <DashboardContainer>
        <ListContainer>
          <List animated size="massive" verticalAlign="middle" selection>
            {routesList.map((item, id) => (
              <List.Item
                key={id}
                onClick={this.redirect.bind(this, item.route)}
              >
                {this.getItemContent(item)}
              </List.Item>
            ))}
            <List.Item onClick={unsetClient}>
              <List.Content>
                <List.Header>Logout</List.Header>
              </List.Content>
            </List.Item>
          </List>
        </ListContainer>
      </DashboardContainer>
    ) : null
  }
}

Dashboard.propTypes = {
  unsetClient: PropTypes.func.isRequired,
  setActiveConnection: PropTypes.func.isRequired,
  messages: PropTypes.object.isRequired,
  dashboard: PropTypes.object.isRequired,
  dashboardUpdated: PropTypes.func.isRequired,
  dashboardErrorReceived: PropTypes.func.isRequired,
  updatesRequestSuccess: PropTypes.func.isRequired,
  client: PropTypes.object.isRequired,
}
