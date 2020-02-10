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

const Questions: React.FC<QuestionsProps> = ({
  questions,
  members,
  sendAnswer,
  sendDoneMsg,
  questionsRequest,
}) => {
  return (
    <Mount on={() => questionsRequest('NOT_ANSWERED')}>
      <>
        <Header size="huge">Questions</Header>
        <QuestionsList
          questions={questions}
          sendAnswer={sendAnswer}
          sendDoneMsg={sendDoneMsg}
          tabChange={(e, data) =>
            questionsRequest(data.panes[data.activeIndex].id)
          }
          members={members.list}
        />
      </>
    </Mount>
  )
}

export default Questions
