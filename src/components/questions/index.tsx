import QuestionGroups from 'components/questions/questions-list/QuestionGroups'
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
  ])
  return (
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

      <QuestionGroups selectedFilters={selectedFilters} />
    </>
  )
}

export default Questions
