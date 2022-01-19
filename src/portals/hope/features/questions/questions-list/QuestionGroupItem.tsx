import styled from '@emotion/styled'
import { QuestionGroupInfo } from 'portals/hope/features/questions/questions-list/QuestionGroupInfo'
import React, { useRef } from 'react'
import { QuestionGroup } from 'types/generated/graphql'
import { AnswerForm } from './AnswerForm'

const QuestionGroupWrapper = styled.div<{ isVisible: boolean }>`
  opacity: ${({ isVisible }) => (isVisible ? 1 : 0)};
  transform: ${({ isVisible }) => (isVisible ? 'scale(1)' : 'scale(0.8)')};
  transition: all 0.8s ease-out;
  padding: 3rem 1.5rem;
  margin-left: -1.5rem;
  margin-bottom: 3rem;
  margin-right: 3rem;
  border-radius: 0.5rem;
  max-width: 50rem;
  width: 50%;
  min-width: 350px;
  background: ${({ theme }) => theme.accentLighter};
  border: 1px solid ${({ theme }) => theme.border};
  outline: none;
  position: relative;

  &:focus {
    box-shadow: 0 7px 8px 6px rgba(34, 60, 80, 0.2);
  }
`

export interface QuestionGroupItemProps {
  questionGroup: QuestionGroup
  isGroupFocused: boolean
  isFocusedInside: boolean
}

export const QuestionGroupItem: React.FC<QuestionGroupItemProps> = ({
  questionGroup,
  isGroupFocused,
  isFocusedInside,
}) => {
  const [isVisible, setVisible] = React.useState(false)

  const groupRef = useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setVisible(true)
  }, [])

  React.useEffect(() => {
    if (isGroupFocused && groupRef.current) {
      groupRef.current.focus()
    }
  }, [isGroupFocused, groupRef])

  return (
    <QuestionGroupWrapper
      key={questionGroup.id}
      isVisible={isVisible}
      ref={groupRef}
      tabIndex={0}
    >
      <QuestionGroupInfo group={questionGroup} />
      <AnswerForm
        memberId={questionGroup.memberId}
        onDone={() => setVisible(false)}
        onError={() => setVisible(true)}
        isFocused={isFocusedInside}
        isGroupFocused={isGroupFocused}
      />
    </QuestionGroupWrapper>
  )
}
