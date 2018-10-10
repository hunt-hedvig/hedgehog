import SockJS from 'sockjs-client';
import Stomp from '@stomp/stompjs';
import config from 'api/config';
import * as dashboard from './dashboard';
import * as membersList from './members';
import * as chat from './chat';

/* eslint-disable no-undef */
export const connect = () => {
    return new Promise((resolve, reject) => {
        const socket = new SockJS(`${config.ws.endpoint}`);
        const stompClient = Stomp.over(socket);
        stompClient.connect(
            {},
            () => {
                resolve(stompClient);
            },
            () => {
                reject(null);
            }
        );
    });
};

export const disconnect = (connection, subscription) => {
    if (connection) connection.disconnect();
    if (subscription) subscription.unsubscribe();
};

export const dashboardSubscribe = dashboard.subscribe;
export const membersListSubscribe = membersList.subscribe;
export const chatSubscribe = chat.subscribe;
export const chatReconnect = chat.reconnect;