import config from 'api/config';
import { connect } from './index';
import api from 'api';

const connectError = { stompClient: null, subscription: null };

const responseHandler = (actions, response) => {
    const parsedRes = JSON.parse(response.body);
    const data = parsedRes.payload;

    if (parsedRes.type === 'ERROR') {
        actions.showNotification({
            message: data.message,
            header: 'Messages',
            type: data.code === 400 ? 'yellow' : 'red'
        });
        return;
    }
    actions.messageReceived(data.messages);
};

export const subscribe = (actions, id, user, stompClient) => {
    if (stompClient) {
        try {
            const subscription = stompClient.subscribe(
                `${config.ws.messagesPrefix}${user}${config.ws.messages}${id}`,
                responseHandler.bind(this, actions)
            );
            stompClient.send(config.ws.history + id);
            return { stompClient, subscription };
        } catch (error) {
            return connectError;
        }
    } else {
        return connectError;
    }
};

/* eslint-disable no-undef */
export const reconnect = async (actions, id, user) => {
    try {
        const response = user ? user : await api(config.login.login);
        const connection = await connect();
        const { stompClient, subscription } = subscribe(
            actions,
            id,
            user || response.data.id,
            connection
        );
        return { stompClient, subscription };
    } catch (error) {
        return connectError;
    }
};
