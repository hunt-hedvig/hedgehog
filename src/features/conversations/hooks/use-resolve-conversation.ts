import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import {
  GetQuestionsGroupsDocument,
  useMarkQuestionAsResolvedMutation,
} from 'types/generated/graphql'
import { Keys, useKeyIsPressed } from 'utils/hooks/key-press-hook'

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
  const isCommandPressed = useKeyIsPressed(Keys.Command)
  const isEnterPressed = useKeyIsPressed(Keys.Enter)

  useEffect(() => {
    if (
      isShiftPressed &&
      isCommandPressed &&
      isEnterPressed &&
      !loading &&
      memberId
    ) {
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
  }, [isShiftPressed, isCommandPressed, isEnterPressed])
}