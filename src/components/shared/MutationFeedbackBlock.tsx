import React from 'react'
import PopupFeedbackBlock from './PopupFeedbackBlock'

export type MutationStatus = 'COMPLETED' | 'FAILED' | ''

interface Messages {
  COMPLETED: string
  FAILED: string
  [key: string]: string
}

interface MutationFeedbackBlockProps {
  status: MutationStatus
  messages: Messages
  onTimeout: () => void
}

export const MutationFeedbackBlock: React.SFC<MutationFeedbackBlockProps> = ({
  status,
  messages,
  onTimeout,
}) => {
  let duration = 3000

  if (status === 'FAILED') {
    duration = 4000
  }

  if (status === 'COMPLETED') {
    duration = 3000
  }

  return (
    <PopupFeedbackBlock
      message={messages[status]}
      onTimeout={onTimeout}
      duration={duration}
    />
  )
}
