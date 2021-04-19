import styled from '@emotion/styled'
import { QuestionGroup } from 'api/generated/graphql'
import { QuestionGroupItem } from 'components/questions/questions-list/QuestionGroupItem'
import { withFadeIn } from 'hedvig-ui/animations/fade-in'
import { StandaloneMessage } from 'hedvig-ui/animations/standalone-message'
import React from 'react'
import { Segment } from 'semantic-ui-react'

const List = styled(Segment)`
  width: 100%;
  &&& {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }
`

const FadeInQuestionGroup = withFadeIn(QuestionGroupItem)

export const FilteredQuestionGroups: React.FC<{
  filterQuestionGroups: ReadonlyArray<QuestionGroup>
}> = ({ filterQuestionGroups }) => {
  return (
    <List>
      {filterQuestionGroups.length ? (
        <>
          {filterQuestionGroups.map((questionGroup, index) => (
            <FadeInQuestionGroup
              delay={`${index * 100}ms`}
              key={questionGroup.id}
              questionGroup={questionGroup}
            />
          ))}
        </>
      ) : (
        <StandaloneMessage paddingTop="25vh">List is empty</StandaloneMessage>
      )}
    </List>
  )
}
