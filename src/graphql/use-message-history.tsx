import {
  ChatMessage,
  GetMessageHistoryQueryHookResult,
  useGetMessageHistoryQuery,
} from 'api/generated/graphql'

export type Message = ChatMessage & {
  body: object
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
  const messageHistory = queryResult?.data?.messageHistory as
    | Message[]
    | undefined

  messageHistory?.forEach(
    (message) =>
      ((message as Message).body = JSON.parse(message.messageBodyJsonString)),
  )
  return [messageHistory, queryResult]
}
