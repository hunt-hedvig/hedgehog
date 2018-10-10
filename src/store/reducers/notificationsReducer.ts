import initialState from '../initialState';
import {
    NOTIFICATION_CLEAR,
    NOTIFICATION_DISMISS,
    NOTIFICATION_SHOW
} from '../constants/notifications';

export default function(state = initialState.notifications, action) {
    switch (action.type) {
        case NOTIFICATION_CLEAR:
            return [];

        case NOTIFICATION_DISMISS:
            return state.filter(item => item.id !== action.id);

        case NOTIFICATION_SHOW:
            return [...state, action.data];

        default:
            return state;
    }
}
