import * as StompModule from '@stomp/stompjs/esm5'
import config from 'api/config'
import SockJS from 'sockjs-client'
import * as chat from './chat'
import * as dashboard from './dashboard'
import * as membersList from './members'

/* eslint-disable no-undef */
export const connect = () => {
  return new Promise((resolve, reject) => {
    const socket = new SockJS(`${config.ws.endpoint}`)
    const stompClient = StompModule.Stomp.over(socket)
    stompClient.connect(
      {},
      () => {
        resolve(stompClient)
      },
      () => {
        reject(null)
      },
    )
  })
}

export const disconnect = (connection, subscription) => {
  if (connection) {
    connection.disconnect()
  }
  if (subscription) {
    subscription.unsubscribe()
  }
}

export const dashboardSubscribe = dashboard.subscribe
export const membersListSubscribe = membersList.subscribe
export const chatSubscribe = chat.subscribe
export const chatReconnect = chat.reconnect
