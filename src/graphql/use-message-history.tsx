import {
  ChatMessage,
  GetMessageHistoryQueryHookResult,
  useGetMessageHistoryQuery,
} from 'api/generated/graphql'

export type Message = ChatMessage & {
  body: any
}

type MessageHistoryReturnTuple = [
  Message[] | undefined,
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
  const messageHistory = queryResult?.data?.messageHistory?.map((message) => ({
    ...message,
    body: JSON.parse(message.messageBodyJsonString),
  })) as Message[] | undefined

  return [messageHistory, queryResult]
}
