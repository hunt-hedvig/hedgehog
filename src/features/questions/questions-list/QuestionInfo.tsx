import { Question } from 'api/generated/graphql'
import { parseISO } from 'date-fns'
import { Message } from 'features/member/messages/Message'
import React from 'react'

export const QuestionInfo: React.FC<{ question: Question }> = ({
  question,
}) => {
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
    <Message
      key={question.id}
      content={content}
      left={false}
      isQuestionMessage={true}
      timestamp={parseISO(question.timestamp)}
    />
  )
}
