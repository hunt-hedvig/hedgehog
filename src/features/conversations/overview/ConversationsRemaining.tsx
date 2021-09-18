import { Flex } from '@hedvig-ui'
import React from 'react'

export const ConversationsRemaining: React.FC<{ count: number }> = ({
  count,
}) => {
  return (
    <Flex
      direction="column"
      justify={'flex-end'}
      align={'center'}
      style={{ marginTop: '10em' }}
    >
      <span style={{ fontSize: '4em' }}>{count}</span>
      <span style={{ fontSize: '0.9em', color: '#888888' }}>
        Conversation{count !== 1 && 's'} remaining
      </span>
    </Flex>
  )
}
