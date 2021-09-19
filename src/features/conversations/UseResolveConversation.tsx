import { Button, Flex } from '@hedvig-ui'
import { ConversationsRemaining } from 'features/conversations/overview/ConversationsRemaining'
import React, { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import {
  GetQuestionsGroupsDocument,
  useMarkQuestionAsResolvedMutation,
} from 'types/generated/graphql'
import { Keys, useKeyIsPressed } from 'utils/hooks/key-press-hook'

export const ConversationsOverview: React.FC<{
  conversationsRemaining: number
}> = ({ conversationsRemaining }) => {
  return (
    <>
      <Flex fullWidth justify={'flex-end'}>
        <Button
          size={'small'}
          variation="ghost"
          style={{ marginLeft: '1.0em' }}
        >
          Turn this feature off
        </Button>
        <Button
          size={'small'}
          variation="ghost"
          style={{ marginLeft: '1.0em' }}
        >
          Give feedback
        </Button>
      </Flex>
      <Flex direction={'column'} align={'center'} fullWidth>
        <ConversationsRemaining count={conversationsRemaining} />
        <Button size={'small'} style={{ marginTop: '2.0em' }}>
          Change filters
        </Button>
      </Flex>
    </>
  )
}

export const useResolveConversation = (
  onResolve: () => void,
  memberId?: string,
) => {
  const [markAsResolved, { loading }] = useMarkQuestionAsResolvedMutation({
    refetchQueries: [
      {
        query: GetQuestionsGroupsDocument,
      },
    ],
  })

  const isShiftPressed = useKeyIsPressed(Keys.Shift)
  const isOptionPressed = useKeyIsPressed(Keys.Option)

  useEffect(() => {
    if (isShiftPressed && isOptionPressed && !loading && memberId) {
      toast.promise(
        markAsResolved({
          variables: { memberId },
          optimisticResponse: {
            markQuestionAsResolved: true,
          },
        }),
        {
          loading: 'Marking as resolved',
          success: () => {
            onResolve()
            return 'Marked as resolved'
          },
          error: 'Could not mark as resolved',
        },
      )
    }
  }, [isShiftPressed, isOptionPressed])

  return null
}
