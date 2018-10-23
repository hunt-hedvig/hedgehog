import {
  ANSWER_ERROR,
  QUESTION_ANSWER_SUCCESS,
  QUESTION_ANSWERING,
  QUESTION_DONE_MSG,
  QUESTION_ERROR,
  QUESTIONS_REQUEST_SUCCESS,
  QUESTIONS_REQUESTING,
} from '../constants/questions'

export const questionsRequest = () => ({
  type: QUESTIONS_REQUESTING,
})

export const questionsReqSuccess = (questions) => ({
  type: QUESTIONS_REQUEST_SUCCESS,
  questions,
})

export const questionsReqError = (error) => ({
  type: QUESTION_ERROR,
  error,
})

export const sendAnswer = (data) => ({
  type: QUESTION_ANSWERING,
  data,
})

export const answerSuccess = (data) => ({
  type: QUESTION_ANSWER_SUCCESS,
  data,
})

export const sendDoneMsg = (data) => ({
  type: QUESTION_DONE_MSG,
  data,
})

export const answerError = (error) => ({
  type: ANSWER_ERROR,
  error,
})
