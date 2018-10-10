import initialState from '../initialState';
import {
    QUESTIONS_REQUESTING,
    QUESTIONS_REQUEST_SUCCESS,
    QUESTION_ANSWERING,
    QUESTION_ANSWER_SUCCESS,
    QUESTION_ERROR,
    QUESTION_DONE_MSG
} from '../constants/questions';
import { sortQuestions, replaceAnswer } from '../../lib/helpers';

export default function(state = initialState.questions, action) {
    switch (action.type) {
        case QUESTIONS_REQUESTING:
        case QUESTION_ANSWERING:
            return {
                ...state,
                requesting: true
            };

        case QUESTIONS_REQUEST_SUCCESS:
            return {
                requesting: false,
                list: sortQuestions({ ...action.questions })
            };

        case QUESTION_ANSWER_SUCCESS:
            return {
                ...state,
                requesting: false,
                list: replaceAnswer({ ...state.list }, action.data)
            };

        case QUESTION_ERROR:
            return {
                errors: [...state.errors, action.error],
                requesting: false
            };

        case QUESTION_DONE_MSG:
            return {
                ...state,
                requesting: false
            };

        default:
            return state;
    }
}
