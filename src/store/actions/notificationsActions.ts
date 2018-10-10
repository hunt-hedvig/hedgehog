import {
    NOTIFICATION_CLEAR,
    NOTIFICATION_DISMISS,
    NOTIFICATION_SHOW
} from '../constants/notifications';

export const showNotification = data => ({
    type: NOTIFICATION_SHOW,
    data: {
        ...data,
        id: Math.floor(Math.random() * 10000)
    }
});

export const dismissNotification = id => ({ type: NOTIFICATION_DISMISS, id });

export const clearAllNotifications = () => ({ type: NOTIFICATION_CLEAR });
