import * as React from 'react'
import { Mount } from 'react-lifecycle-components'
import { useInsecurePersistentState } from 'utils/state'
import { Spacing } from '../../../shared/hedvig-ui/spacing'
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
        <Spacing bottom="large">
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
        </Spacing>

        <QuestionsList
          questions={questions}
          selectedFilters={selectedFilters}
          sendAnswer={sendAnswer}
          sendDoneMsg={sendDoneMsg}
          tabChange={(_, data) =>
            questionsRequest(data.panes[data.activeIndex].id)
          }
          members={members.list}
        />
      </>
    </Mount>
  )
}

export default Questions
