import QuestionGroups from 'components/questions/questions-list/QuestionGroups'
import { useQuestionGroups } from 'graphql/use-question-groups'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import {
  LoadingMessage,
  StandaloneMessage,
} from 'hedvig-ui/animations/standalone-message'
import { RadioGroup } from 'hedvig-ui/radio'
import { Spacing } from 'hedvig-ui/spacing'
import { ThirdLevelHeadline } from 'hedvig-ui/typography'
import React, { useState } from 'react'
import { useInsecurePersistentState } from 'utils/state'
import { FilterState, QuestionsFilter, totalNumberOfColors } from './filter'

const teamOptions = [...Array(totalNumberOfColors - 1)].map((_, i) => {
  return {
    value: i + 2,
    label: (i + 2).toString(),
  }
})

const Questions: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useInsecurePersistentState<
    ReadonlyArray<FilterState>
  >('questions:filters', [
    FilterState.Red,
    FilterState.Green,
    FilterState.Sweden,
    FilterState.Norway,
    FilterState.HasOpenClaim,
    FilterState.NoOpenClaim,
  ])

  const [questionGroups, { loading }] = useQuestionGroups()

  const [numberTeamColors, setNumberTeamColors] = useState(2)

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
  console.log(numberTeamColors)

  return (
    <>
      <Spacing bottom="large">
        <FadeIn>
          <ThirdLevelHeadline>
            <strong>Number of teams:</strong>
          </ThirdLevelHeadline>
          <RadioGroup
            value={numberTeamColors}
            setValue={setNumberTeamColors}
            options={teamOptions}
          />
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
            numberTeamColors={numberTeamColors}
          />
        </FadeIn>
      </Spacing>

      <QuestionGroups
        numberTeamColors={numberTeamColors}
        selectedFilters={selectedFilters}
        questionGroups={questionGroups}
      />
    </>
  )
}

export default Questions
