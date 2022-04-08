import { StandaloneMessage } from '@hedvig-ui'
import { Keys, useKeyIsPressed } from '@hedvig-ui'
import { useTitle, useNavigation } from '@hedvig-ui'
import React, { useEffect, useState } from 'react'
import { QuestionGroup } from 'types/generated/graphql'
import { QuestionGroupItem } from './QuestionGroupItem'

export const FilteredQuestionGroups: React.FC<{
  filterQuestionGroups: ReadonlyArray<QuestionGroup>
}> = ({ filterQuestionGroups }) => {
  const [focusedItem, setFocusedItem] = useState<string | null>(null)

  const { registerList } = useNavigation()

  const { registerItem } = registerList({
    list: [...filterQuestionGroups],
    name: 'Question',
    nameField: 'memberId',
    resolve: (item) => {
      setFocusedItem(item.memberId)
      return `Question-${item.memberId}`
    },
    autoFocus: true,
  })

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
          {filterQuestionGroups.map((questionGroup, index) => (
            <QuestionGroupItem
              delay={`${index * 100}ms`}
              key={questionGroup.id}
              isFocused={questionGroup.memberId === focusedItem || false}
              questionGroup={questionGroup}
              {...registerItem(questionGroup)}
            />
          ))}
        </>
      ) : (
        <StandaloneMessage paddingTop="25vh">List is empty</StandaloneMessage>
      )}
    </div>
  )
}
