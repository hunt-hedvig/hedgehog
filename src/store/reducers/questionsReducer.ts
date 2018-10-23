import { replaceAnswer, sortQuestions } from '../../lib/helpers'
import {
  QUESTION_ANSWER_SUCCESS,
  QUESTION_ANSWERING,
  QUESTION_DONE_MSG,
  QUESTION_ERROR,
  QUESTIONS_REQUEST_SUCCESS,
  QUESTIONS_REQUESTING,
} from '../constants/questions'
import initialState from '../initialState'

export default function(state = initialState.questions, action) {
  switch (action.type) {
    case QUESTIONS_REQUESTING:
    case QUESTION_ANSWERING:
      return {
        ...state,
        requesting: true,
      }

    case QUESTIONS_REQUEST_SUCCESS:
      return {
        requesting: false,
        list: sortQuestions({ ...action.questions }),
      }

    case QUESTION_ANSWER_SUCCESS:
      return {
        ...state,
        requesting: false,
        list: replaceAnswer({ ...state.list }, action.data),
      }

    case QUESTION_ERROR:
      return {
        errors: [...state.errors, action.error],
        requesting: false,
      }

    case QUESTION_DONE_MSG:
      return {
        ...state,
        requesting: false,
      }

    default:
      return state
  }
}
