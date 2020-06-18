import Message from 'components/member/messages/Message'
import React from 'react'
import styled from 'react-emotion'

const QuestionWrapper = styled.div<{ isVisible: boolean }>`
  opacity: ${(props) => (props.isVisible ? 1 : 0)};
  transform: ${(props) => (props.isVisible ? 'scale(1)' : 'scale(0.8)')};
  transition: all 0.8s ease-out;
`

export const Question = ({ question }) => {
  const [isVisible, setVisible] = React.useState(false)

  React.useEffect(() => {
    setVisible(true)
  })

  return (
    <QuestionWrapper key={question.id} isVisible={isVisible}>
      <Message
        content={JSON.parse(question.messageJsonString).body}
        left={false}
        isQuestionMessage={true}
        timestamp={question.timestamp}
        from={null}
      />
    </QuestionWrapper>
  )
}
