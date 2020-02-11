import * as React from 'react'
import { Mount } from 'react-lifecycle-components'
import { Header } from 'semantic-ui-react'
import { isMemberIdEven } from 'utils/member'
import { useInsecurePersistentState } from 'utils/state'
import { MembersStore } from '../../store/storeTypes'
import {
  QuestionListKind,
  QuestionsStore,
} from '../../store/types/questionsTypes'
import { FilterState, QuestionsFilter } from './filter'
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
  const [selectedFilters, setSelectedFilters] = useInsecurePersistentState<
    ReadonlyArray<FilterState>
  >('questions:filters', [FilterState.Even, FilterState.Odd])

  return (
    <Mount on={() => questionsRequest('NOT_ANSWERED')}>
      <>
        <Header size="huge">Questions</Header>

        <QuestionsFilter
          selected={selectedFilters}
          onToggle={(newFilter) => {
            if (selectedFilters.includes(newFilter)) {
              setSelectedFilters(
                selectedFilters.filter((filter) => filter !== newFilter),
              )
            } else {
              setSelectedFilters([...selectedFilters, newFilter])
            }
          }}
        />

        <QuestionsList
          questions={questions}
          selectedFilters={selectedFilters}
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
