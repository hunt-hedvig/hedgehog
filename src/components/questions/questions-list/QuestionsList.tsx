import * as PropTypes from 'prop-types'
import * as React from 'react'
import { Tab } from 'semantic-ui-react'
import styled from 'styled-components'
import SortedList from './SortedList'

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 700px;
  margin: 0 auto 50px;
`

const QuestionsList = ({
  questions,
  members,
  sendAnswer,
  tabChange,
  sendDoneMsg,
}: any) => {
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

QuestionsList.propTypes = {
  questions: PropTypes.object.isRequired,
  sendAnswer: PropTypes.func.isRequired,
  sendDoneMsg: PropTypes.func.isRequired,
  tabChange: PropTypes.func.isRequired,
  members: PropTypes.array,
}

export default QuestionsList
