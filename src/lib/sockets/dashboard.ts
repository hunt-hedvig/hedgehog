import config from 'api/config'

const connectError = { stompClient: null, subscription: null }

const responseHandler = (actions, response) => {
  const data = JSON.parse(response.body)

  if (data.type === 'ERROR') {
    actions.errorReceived(data)
    return
  }
  const result = {}

  data.forEach((item) => {
    result[item.type] = item.count
  })
  if (data.length === 1) {
    actions.dashboardUpdated(result)
  } else {
    actions.updatesRequestSuccess(result)
  }
}

export const subscribe = (actions, user, stompClient) => {
  if (stompClient) {
    try {
      const subscription = stompClient.subscribe(
        `${config.ws.dashboardSub}${user}/updates`,
        responseHandler.bind(this, actions),
      )
      stompClient.send(config.ws.dashboardUpdates)
      return { stompClient, subscription }
    } catch (error) {
      return connectError
    }
  } else {
    return connectError
  }
}
