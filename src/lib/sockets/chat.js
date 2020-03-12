import api from 'api'
import config from 'api/config'
import { connect } from './index'

const connectError = { stompClient: null, subscription: null }

const responseHandler = (actions, response) => {
  const parsedRes = JSON.parse(response.body)
  const data = parsedRes.payload

  if (parsedRes.type === 'ERROR') {
    actions.showNotification({
      message: data.message,
      header: 'Messages',
      type: data.code === 400 ? 'yellow' : 'red',
    })
    return
  }
  actions.messageReceived(data.messages)
}

export const subscribe = (actions, memberId, auth, stompClient) => {
  if (stompClient) {
    try {
      const subscription = stompClient.subscribe(
        `${config.ws.messagesPrefix}${auth}${config.ws.messages}${memberId}`,
        responseHandler.bind(this, actions),
      )
      stompClient.send(config.ws.history + memberId)
      return { stompClient, subscription }
    } catch (error) {
      return connectError
    }
  } else {
    return connectError
  }
}

/* eslint-disable no-undef */
export const reconnect = async (actions, memberId, auth) => {
  try {
    const response = auth ? auth : await api(config.login.login)
    const connection = await connect()
    const { stompClient, subscription } = subscribe(
      actions,
      memberId,
      auth || response.data.id,
      connection,
    )
    return { stompClient, subscription }
  } catch (error) {
    console.error(error)
    return connectError
  }
}
