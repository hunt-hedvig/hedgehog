import { Button, Flex } from '@hedvig-ui'
import { ConversationsRemaining } from 'features/conversations/overview/ConversationsRemaining'
import React from 'react'
import { useHistory } from 'react-router'

export const ConversationsOverview: React.FC<{
  conversationsRemaining: number
}> = ({ conversationsRemaining }) => {
  const history = useHistory()

  return (
    <>
      <Flex justify={'flex-end'}>
        <Button size={'small'} variation="ghost">
          Turn this feature off
        </Button>
        <Button size={'small'} variation="ghost">
          Give feedback
        </Button>
      </Flex>
      <Flex direction={'column'} align={'center'}>
        <ConversationsRemaining count={conversationsRemaining} />
        <Button
          size={'small'}
          style={{ marginTop: '2.0em' }}
          onClick={() => history.push('/conversations/settings')}
        >
          Change filters
        </Button>
      </Flex>
    </>
  )
}
