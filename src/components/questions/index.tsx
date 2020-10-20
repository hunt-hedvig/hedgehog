import QuestionGroups from 'components/questions/questions-list/QuestionGroups'
import { useQuestionGroups } from 'graphql/use-question-groups'
import {
  MajorLoadingMessage,
  MajorMessage,
} from 'hedvig-ui/animations/major-message'
import { Spacing } from 'hedvig-ui/spacing'
import * as React from 'react'
import { useInsecurePersistentState } from 'utils/state'
import { FilterState, QuestionsFilter } from './filter'

const Questions: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useInsecurePersistentState<
    ReadonlyArray<FilterState>
  >('questions:filters', [
    FilterState.Even,
    FilterState.Odd,
    FilterState.Sweden,
    FilterState.Norway,
    FilterState.HasOpenClaim,
    FilterState.NoOpenClaim,
  ])

  const [questionGroups, { loading }] = useQuestionGroups()

  if (loading) {
    return <MajorLoadingMessage>Loading</MajorLoadingMessage>
  }

  if (!questionGroups) {
    return <MajorMessage>Something went wrong!</MajorMessage>
  }

  return (
    <>
      <Spacing bottom="large">
        <QuestionsFilter
          questionGroups={questionGroups}
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

      <QuestionGroups
        selectedFilters={selectedFilters}
        questionGroups={questionGroups}
      />
    </>
  )
}

export default Questions
