import styled from '@emotion/styled'
import { StandaloneMessage, withFadeIn } from '@hedvig-ui'
import { QuestionGroup } from 'api/generated/graphql'
import React from 'react'
import { Segment } from 'semantic-ui-react'
import { QuestionGroupItem, QuestionGroupItemProps } from './QuestionGroupItem'

const List = styled(Segment)`
  width: 100%;
  &&& {
    display: flex;
    flex-direction: column;
    margin: 0 auto;
  }
`

const FadeInQuestionGroup = withFadeIn<QuestionGroupItemProps>(
  QuestionGroupItem,
)

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
