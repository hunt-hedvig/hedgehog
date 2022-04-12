import styled from '@emotion/styled'
import {
  FadeIn,
  LoadingMessage,
  Spacing,
  StandaloneMessage,
  ThirdLevelHeadline,
} from '@hedvig-ui'
import { FilterSelect } from 'portals/hope/features/questions/FilterSelect'
import { NumberMemberGroupsRadioButtons } from 'portals/hope/features/questions/number-member-groups-radio-buttons'
import { QuestionGroups } from 'portals/hope/features/questions/questions-list/QuestionGroups'
import React from 'react'
import { Page } from 'portals/hope/pages/routes'
import { useQuestionGroups } from 'portals/hope/features/questions/hooks/use-question-groups'
import { useSelectedFilters } from 'portals/hope/features/questions/hooks/use-selected-filters'

const ListPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  margin: 0;
`

const QuestionsPage: Page = () => {
  const { selectedFilters, toggleFilter } = useSelectedFilters()
  const [questionGroups, { loading }] = useQuestionGroups()

  if (loading) {
    return <LoadingMessage paddingTop="25vh" />
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
      <Spacing bottom="large" top="large">
        <FadeIn>
          <Spacing bottom>
            <ThirdLevelHeadline>
              <strong>Number of member groups</strong>
            </ThirdLevelHeadline>
            <NumberMemberGroupsRadioButtons />
          </Spacing>
          <FilterSelect
            filters={selectedFilters}
            push="left"
            animationDelay={0}
            animationItemDelay={20}
            onToggle={toggleFilter}
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

export default QuestionsPage
