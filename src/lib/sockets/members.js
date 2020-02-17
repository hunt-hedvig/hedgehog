import config from 'api/config'

const connectError = { stompClient: null, subscription: null }

const responseHandler = (actions, response) => {
  const data = JSON.parse(response.body)

  if (data.type === 'ERROR') {
    actions.errorReceived(data)
    return
  }

  actions.newMessagesReceived(data)
}

export const subscribe = (actions, member, stompClient) => {
  if (stompClient) {
    try {
      const subscription = stompClient.subscribe(
        `${config.ws.newMessagesSub}${member}/updates`,
        responseHandler.bind(this, actions),
      )
      stompClient.send(config.ws.messagesUpdates)
      return { stompClient, subscription }
    } catch (error) {
      return connectError
    }
  } else {
    return connectError
  }
}
