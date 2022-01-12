import { parseISO } from 'date-fns'
import { Message } from 'portals/hope/features/member/messages/components/Message'
import React from 'react'
import { Question } from 'types/generated/graphql'

export const QuestionInfo: React.FC<{ question: Question }> = ({
  question,
}) => {
  let content

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
