import {
  GetMessageHistoryQueryHookResult,
  useGetMessageHistoryQuery,
} from 'api/generated/graphql'

type MessageHistoryReturnTuple = [
  object[] | undefined,
  GetMessageHistoryQueryHookResult,
]

export const useMessageHistory = (
  memberId: string,
): MessageHistoryReturnTuple => {
  const queryResult = useGetMessageHistoryQuery({
    variables: {
      memberId,
    },
    pollInterval: 2000,
  })
  const messageHistory = queryResult?.data?.messageHistory
    ?.map((message) => JSON.parse(message.messageAsJson))
    ?.reverse()
  return [messageHistory, queryResult]
}
