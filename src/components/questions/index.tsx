import { NumberColorsRadioButtons } from 'components/questions/number-colors-radio-buttons'
import QuestionGroups from 'components/questions/questions-list/QuestionGroups'
import { useQuestionGroups } from 'graphql/use-question-groups'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import {
  LoadingMessage,
  StandaloneMessage,
} from 'hedvig-ui/animations/standalone-message'
import { Spacing } from 'hedvig-ui/spacing'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React from 'react'
import { useInsecurePersistentState } from 'utils/state'
import { FilterState, QuestionsFilter } from './filter'

const Questions: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useInsecurePersistentState<
    ReadonlyArray<FilterState>
  >('questions:filters', [
    FilterState.First,
    FilterState.Second,
    FilterState.Sweden,
    FilterState.Norway,
    FilterState.HasOpenClaim,
    FilterState.NoOpenClaim,
  ])

  const [questionGroups, { loading }] = useQuestionGroups()

  if (loading) {
    return <LoadingMessage paddingTop={'25vh'} />
  }

  if (!questionGroups) {
    return (
      <StandaloneMessage paddingTop="25vh">
        Something went wrong!
      </StandaloneMessage>
    )
  }

  return (
    <>
      <Spacing bottom="large">
        <FadeIn>
          <Spacing bottom>
            <ThirdLevelHeadline>
              <strong>Number of colors:</strong>
            </ThirdLevelHeadline>
            <NumberColorsRadioButtons />
          </Spacing>
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
        </FadeIn>
      </Spacing>

      <QuestionGroups
        selectedFilters={selectedFilters}
        questionGroups={questionGroups}
      />
    </>
  )
}

export default Questions
