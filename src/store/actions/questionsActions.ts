import {
  ANSWER_ERROR,
  QUESTION_ANSWER_SUCCESS,
  QUESTION_ANSWERING,
  QUESTION_DONE_MSG,
  QUESTION_ERROR,
  QUESTIONS_REQUEST_SUCCESS,
  QUESTIONS_REQUESTING,
} from '../constants/questions'
import { QuestionGroup, QuestionListKind } from '../types/questionsTypes'

export const questionsRequest = (listType: QuestionListKind) => ({
  type: QUESTIONS_REQUESTING,
  listType,
})

export const questionsReqSuccess = (
  questions: QuestionGroup[],
  listType: QuestionListKind,
) => ({
  type: QUESTIONS_REQUEST_SUCCESS,
  questions,
  listType,
})

export const questionsReqError = (error: Error) => ({
  type: QUESTION_ERROR,
  error,
})

export const sendAnswer = (data: any) => ({
  type: QUESTION_ANSWERING,
  data,
})

export const answerSuccess = (data: any) => ({
  type: QUESTION_ANSWER_SUCCESS,
  data,
})

export const sendDoneMsg = (data: any) => ({
  type: QUESTION_DONE_MSG,
  data,
})

export const answerError = (error: Error) => ({
  type: ANSWER_ERROR,
  error,
})
