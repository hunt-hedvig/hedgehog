import styled from '@emotion/styled'
import { Flex } from '@hedvig-ui'
import React from 'react'

const Subtext = styled.span`
  font-size: 0.9em;
  color: ${({ theme }) => theme.placeholderColor};
`

export const ConversationsRemaining: React.FC<{ count: number }> = ({
  count,
}) => {
  return (
    <Flex direction="column" justify="flex-end" align="center">
      <span style={{ fontSize: '3em' }}>{count}</span>
      <Subtext>Conversation{count !== 1 && 's'} remaining</Subtext>
    </Flex>
  )
}
