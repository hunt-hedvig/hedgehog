import { MutationFunctionOptions } from '@apollo/react-common'
import {
  GetMessageHistoryDocument,
  SendMessageMutation,
  SendMessageMutationVariables,
  useSendMessageMutation,
} from 'api/generated/graphql'

export const useSendMessage = () => {
  return useSendMessageMutation()
}

export const getSendMessageOptions = (
  memberId: string,
  message: string,
  forceSendMessage: boolean,
): MutationFunctionOptions<
  SendMessageMutation,
  SendMessageMutationVariables
> => {
  return {
    variables: {
      input: {
        memberId,
        message,
        forceSendMessage,
      },
    },
    refetchQueries: () => [
      {
        query: GetMessageHistoryDocument,
        variables: {
          memberId,
        },
      },
    ],
  }
}
