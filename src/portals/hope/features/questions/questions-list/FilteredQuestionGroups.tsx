import React, { useEffect, useState } from 'react'
import { StandaloneMessage } from '@hedvig-ui'
import { useTitle } from '@hedvig-ui/hooks/use-title'
import { useNavigation } from '@hedvig-ui/hooks/navigation/use-navigation'
import { QuestionGroup } from 'types/generated/graphql'
import { QuestionGroupItem } from './QuestionGroupItem'
import {
  Keys,
  useKeyIsPressed,
} from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'

export const FilteredQuestionGroups: React.FC<{
  filterQuestionGroups: ReadonlyArray<QuestionGroup>
}> = ({ filterQuestionGroups }) => {
  const [focusedItem, setFocusedItem] = useState<string | null>(null)

  const { register } = useNavigation()

  const isEscapePressed = useKeyIsPressed(Keys.Escape)

  useTitle(
    `Questions${
      filterQuestionGroups && filterQuestionGroups.length
        ? ` (${filterQuestionGroups.length})`
        : ''
    }`,
    [filterQuestionGroups],
  )

  useEffect(() => {
    if (isEscapePressed && focusedItem) {
      setFocusedItem(null)
    }
  }, [isEscapePressed])

  return (
    <div>
      {filterQuestionGroups.length ? (
        <>
          {filterQuestionGroups.map((questionGroup, index) => {
            const navigation = register(`Question-${questionGroup.memberId}`, {
              autoFocus: index === 0,
              resolve: () => {
                setFocusedItem(questionGroup.memberId)
                return `Question-${questionGroup.memberId}`
              },
              neighbors: {
                up:
                  index && !focusedItem
                    ? `Question-${filterQuestionGroups[index - 1].memberId}`
                    : undefined,
                down:
                  index < filterQuestionGroups.length - 1 && !focusedItem
                    ? `Question-${filterQuestionGroups[index + 1].memberId}`
                    : undefined,
              },
            })

            return (
              <QuestionGroupItem
                delay={`${index * 100}ms`}
                key={questionGroup.id}
                isFocused={questionGroup.memberId === focusedItem || false}
                questionGroup={questionGroup}
                {...navigation}
              />
            )
          })}
        </>
      ) : (
        <StandaloneMessage paddingTop="25vh">List is empty</StandaloneMessage>
      )}
    </div>
  )
}
