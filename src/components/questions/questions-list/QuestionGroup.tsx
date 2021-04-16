import styled from '@emotion/styled'
import QuestionGroupInfo from 'components/questions/questions-list/QuestionGroupInfo'
import React from 'react'
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
`

export const QuestionGroup = ({ questionGroup }) => {
  const [isVisible, setVisible] = React.useState(false)

  React.useEffect(() => {
    setVisible(true)
  }, [])

  return (
    <QuestionGroupWrapper key={questionGroup.id} isVisible={isVisible}>
      <QuestionGroupInfo questionGroup={questionGroup} />
      <AnswerForm memberId={questionGroup.memberId} setVisible={setVisible} />
    </QuestionGroupWrapper>
  )
}
