import {
  LoadingMessage,
  Spacing,
  StandaloneMessage,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { NumberMemberGroupsRadioButtons } from 'components/questions/number-member-groups-radio-buttons'
import { QuestionGroups } from 'components/questions/questions-list/QuestionGroups'
import { ListPage } from 'components/shared'
import { useQuestionGroups } from 'graphql/use-question-groups'
import { FadeIn } from 'hedvig-ui/animations/fade-in'
import React from 'react'
import { useInsecurePersistentState } from 'utils/state'
import { FilterState, QuestionsFilter } from './filter'

export const QuestionsPage: React.FC = () => {
  const [selectedFilters, setSelectedFilters] = useInsecurePersistentState<
    ReadonlyArray<FilterState>
  >('questions:filters', [
    FilterState.First,
    FilterState.Second,
    FilterState.Third,
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
    <ListPage>
      <Spacing bottom="large">
        <FadeIn>
          <Spacing bottom>
            <ThirdLevelHeadline>
              <strong>Number of member groups:</strong>
            </ThirdLevelHeadline>
            <NumberMemberGroupsRadioButtons />
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
    </ListPage>
  )
}
