import { Button, Flex } from '@hedvig-ui'
import { ConversationsRemaining } from 'features/conversations/overview/ConversationsRemaining'
import React from 'react'
import { useHistory } from 'react-router'
import { useConfirmDialog } from 'utils/hooks/modal-hook'
import { useInsecurePersistentState } from 'utils/state'

export const ConversationsOverview: React.FC<{
  conversationsRemaining: number
}> = ({ conversationsRemaining }) => {
  const history = useHistory()
  const { confirm } = useConfirmDialog()
  const [enabled, setEnabled] = useInsecurePersistentState<boolean>(
    'conversations:enabled',
    false,
  )
  const [onboarded, setOnboarded] = useInsecurePersistentState<boolean>(
    'conversations:onboarded',
    false,
  )

  return (
    <>
      <Flex justify={'flex-end'}>
        <Button
          size={'small'}
          variation="ghost"
          onClick={() =>
            confirm('Do you want to go back to the questions tab?').then(() => {
              setEnabled(false)
              setOnboarded(false)
              history.replace('/questions')
              history.go(0)
            })
          }
        >
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
