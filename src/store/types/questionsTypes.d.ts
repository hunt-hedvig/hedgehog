export interface Personnel {
  id: string
  email: string
  name: string
  picture: string
}

export interface Question {
  id: number
  date: number
  message: any
}

export interface QuestionGroup {
  id: number
  memberId: string
  date: number
  answerDate: number
  answer: string
  personnel: Personnel
  questions: Question[]
}

export interface QuestionList {
  questions: QuestionGroup[]
  requesting: boolean
}

export interface QuestionsStore {
  errors: any[]
  requesting: boolean
  answered: QuestionList
  notAnswered: QuestionList
}

export type QuestionListKind = 'ANSWERED' | 'NOT_ANSWERED'
