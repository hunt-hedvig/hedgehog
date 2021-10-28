import { StandaloneMessage, withFadeIn } from '@hedvig-ui'
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import React, { useEffect, useState } from 'react'
import { QuestionGroup } from 'types/generated/graphql'
import { QuestionGroupItem, QuestionGroupItemProps } from './QuestionGroupItem'

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
  const isCommandPressed = useKeyIsPressed(Keys.Command)
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
    if (isEnterPressed && !isCommandPressed && !focusedInsideItem) {
      setFocusedInsideItem(focusedItem)
    }
  }, [isEnterPressed])

  useEffect(() => {
    if (isEscapePressed && focusedInsideItem) {
      setFocusedInsideItem(0)
    }
  }, [isEscapePressed])

  return (
    <div>
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
    </div>
  )
}
