import { Question } from 'api/generated/graphql'
import Message from 'components/member/messages/Message'
import { parseISO } from 'date-fns'
import React from 'react'
import styled from 'react-emotion'

const QuestionWrapper = styled.div<{ isVisible: boolean }>`
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: ${(props) => (props.isVisible ? 'scale(1)' : 'scale(0.8)')};
  transition: all 0.8s ease-out;
`

export const QuestionInfo: React.FC<{ question: Question }> = ({
  question,
}) => {
  const [isVisible, setVisible] = React.useState(false)

  React.useEffect(() => {
    setVisible(true)
  })

  let content: any
  try {
    content = JSON.parse(question.messageJsonString).body
  } catch (error) {
    console.error(
      'Unable to parse question.messageJsonString',
      question.messageJsonString,
      error,
    )
  }
  if (!content) {
    return <>Unable to parse this message, please contact tech</>
  }
  return (
    <QuestionWrapper key={question.id} isVisible={isVisible}>
      <Message
        content={content}
        left={false}
        isQuestionMessage={true}
        timestamp={parseISO(question.timestamp)}
      />
    </QuestionWrapper>
  )
}
