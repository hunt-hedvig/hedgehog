import initialState from '../initialState';
import {
    CLIENT_SET,
    CLIENT_UNSET,
    CLIENT_CHECK_AUTH,
} from '../constants/login';

export default function clientReducer(state = initialState.client, action) {
    switch (action.type) {
        case CLIENT_SET:
            return {
                ...action.creditals
            };

        case CLIENT_UNSET:
            return {};

        case CLIENT_CHECK_AUTH:
            return state;

        default:
            return state;
    }
}
