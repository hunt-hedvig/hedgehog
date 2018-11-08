import * as React from 'react'
import { Tab } from 'semantic-ui-react'
import styled from 'styled-components'
import { MembersStore } from '../../../store/storeTypes'
import { QuestionsStore } from '../../../store/types/questionsTypes'
import SortedList from './SortedList'

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 700px;
  margin: 0 auto 50px;
`

export interface QuestionsListProps {
  questions: QuestionsStore
  members: MembersStore
  sendAnswer: (answer: any) => void
  sendDoneMsg: (id: string) => void
  tabChange: (event, data) => void
}

const QuestionsList: React.SFC<QuestionsListProps> = ({
  questions,
  members,
  sendAnswer,
  tabChange,
  sendDoneMsg,
}) => {
  const notAnswered = () => (
    <Tab.Pane>
      <SortedList
        list={questions.notAnswered.questions}
        members={members}
        sendAnswer={sendAnswer}
        sendDoneMsg={sendDoneMsg}
      />
    </Tab.Pane>
  )

  const answered = () => (
    <Tab.Pane>
      <SortedList
        list={questions.answered.questions}
        members={members}
        sendAnswer={sendAnswer}
        sendDoneMsg={sendDoneMsg}
      />
    </Tab.Pane>
  )

  const panes = [
    { id: 'NOT_ANSWERED', menuItem: 'Not Answered', render: notAnswered },
    { id: 'ANSWERED', menuItem: 'Answered', render: answered },
  ]

  return (
    <ListContainer>
      <Tab renderActiveOnly={true} panes={panes} onTabChange={tabChange} />
    </ListContainer>
  )
}

export default QuestionsList
