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
      switch (action.listType) {
        case 'ANSWERED':
          return {
            ...state,
            answered: {
              ...state.answered,
              requesting: true,
            },
          }
        case 'NOT_ANSWERED':
          return {
            ...state,
            notAnswered: {
              ...state.notAnswered,
              requesting: true,
            },
          }
        default:
          return state
      }

    case QUESTION_ANSWERING:
      return {
        ...state,
        requesting: true,
      }

    case QUESTIONS_REQUEST_SUCCESS:
      switch (action.listType) {
        case 'ANSWERED':
          return {
            ...state,
            answered: {
              ...state.answered,
              questions: sortQuestions(action.questions),
              requesting: false,
            },
          }

        case 'NOT_ANSWERED':
          return {
            ...state,
            notAnswered: {
              ...state.notAnswered,
              requesting: false,
              questions: sortQuestions(action.questions),
            },
          }

        default:
          return state
      }

    case QUESTION_ANSWER_SUCCESS:
      return {
        ...state,
        ...replaceAnswer(state, action.data),
        requesting: false,
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
