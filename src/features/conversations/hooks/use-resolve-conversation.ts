import { Keys, useKeyIsPressed } from '@hedvig-ui/utils/key-press-hook'
import { usePlatform } from '@hedvig-ui/utils/platform'
import { useEffect } from 'react'
import { toast } from 'react-hot-toast'
import {
  GetQuestionsGroupsDocument,
  useMarkQuestionAsResolvedMutation,
} from 'types/generated/graphql'

export const useResolveConversation = (
  onResolve: () => void,
  memberId?: string,
) => {
  const { metaKey } = usePlatform()
  const [markAsResolved, { loading }] = useMarkQuestionAsResolvedMutation({
    refetchQueries: [
      {
        query: GetQuestionsGroupsDocument,
      },
    ],
  })

  const isShiftPressed = useKeyIsPressed(Keys.Shift)
  const isMetaPressed = useKeyIsPressed(metaKey)
  const isEnterPressed = useKeyIsPressed(Keys.Enter)

  useEffect(() => {
    if (
      isShiftPressed &&
      isMetaPressed &&
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
  }, [isShiftPressed, isMetaPressed, isEnterPressed])
}
