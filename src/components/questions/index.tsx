import * as React from 'react'
import { Mount } from 'react-lifecycle-components'
import { Header } from 'semantic-ui-react'
import { MembersStore } from '../../store/storeTypes'
import {
  QuestionListKind,
  QuestionsStore,
} from '../../store/types/questionsTypes'
import QuestionsList from './questions-list/QuestionsList'

export interface QuestionsProps {
  questions: QuestionsStore
  members: MembersStore
  sendAnswer: (answer: any) => void
  sendDoneMsg: (id: string) => void
  questionsRequest: (listId: QuestionListKind) => void
}

const Questions = ({
  questions,
  members,
  sendAnswer,
  sendDoneMsg,
  questionsRequest,
}: QuestionsProps) => {
  const tabChange = (e, data) => {
    questionsRequest(data.panes[data.activeIndex].id)
  }

  const init = () => questionsRequest('NOT_ANSWERED')

  return (
    <Mount on={init}>
      <React.Fragment>
        <Header size="huge">Questions</Header>
        <QuestionsList
          questions={questions}
          sendAnswer={sendAnswer}
          sendDoneMsg={sendDoneMsg}
          tabChange={tabChange}
          members={members.list}
        />
      </React.Fragment>
    </Mount>
  )
}

export default Questions
