import styled from '@emotion/styled'
import { StandaloneMessage, withFadeIn } from '@hedvig-ui'
import React, { useEffect, useState } from 'react'
import { Segment } from 'semantic-ui-react'
import { QuestionGroup } from 'types/generated/graphql'
import { Keys, useKeyIsPressed } from 'utils/hooks/key-press-hook'
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
  const [focusedItem, setFocusedItem] = useState(1)
  const [focusedInsideItem, setFocusedInsideItem] = useState(0)

  const isUpPressed = useKeyIsPressed(Keys.Up)
  const isDownPressed = useKeyIsPressed(Keys.Down)
  const isEnterPressed = useKeyIsPressed(Keys.Enter)
  const isOptionPressed = useKeyIsPressed(Keys.Option)
  const isEscapePressed = useKeyIsPressed(Keys.Escape)

  useEffect(() => {
    const length = filterQuestionGroups.length

    if (!focusedInsideItem && isDownPressed && focusedItem < length) {
      setFocusedItem((prev) => prev + 1)
    } else if (!focusedInsideItem && isUpPressed && focusedItem > 1) {
      setFocusedItem((prev) => prev - 1)
    } else if (!focusedInsideItem && isUpPressed && focusedItem === 1) {
      setFocusedItem(length)
    } else if (!focusedInsideItem && isDownPressed && focusedItem === length) {
      setFocusedItem(1)
    }
  }, [isUpPressed, isDownPressed])

  useEffect(() => {
    if (isEnterPressed && !isOptionPressed && !focusedInsideItem) {
      setFocusedInsideItem(focusedItem)
    }
  }, [isEnterPressed])

  useEffect(() => {
    if (isEscapePressed && focusedInsideItem) {
      setFocusedInsideItem(0)
    }
  }, [isEscapePressed])

  return (
    <List>
      {filterQuestionGroups.length ? (
        <>
          {filterQuestionGroups.map((questionGroup, index) => (
            <FadeInQuestionGroup
              delay={`${index * 100}ms`}
              key={questionGroup.id}
              questionGroup={questionGroup}
              isGroupFocused={index === focusedItem - 1}
              isFocusedInside={index === focusedInsideItem - 1}
            />
          ))}
        </>
      ) : (
        <StandaloneMessage paddingTop="25vh">List is empty</StandaloneMessage>
      )}
    </List>
  )
}
