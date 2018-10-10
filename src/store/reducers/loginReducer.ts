import initialState from '../initialState';
import { LOGIN_REQUESTING, LOGIN_SUCCESS, LOGIN_ERROR } from '../constants/login';

export default function(state = initialState.login, action) {
    switch (action.type) {
        case LOGIN_REQUESTING:
            return {
                requesting: true
            };

        case LOGIN_SUCCESS:
            return {
                requesting: false
            };

        case LOGIN_ERROR:
            return {
                requesting: false
            };

        default:
            return state;
    }
}
