import { MutationFunctionOptions } from '@apollo/react-common'
import {
  EditMemberInfoInput,
  EditMemberInfoMutation,
  EditMemberInfoMutationHookResult,
  EditMemberInfoMutationVariables,
  GetMemberInfoDocument,
  useEditMemberInfoMutation,
} from 'api/generated/graphql'

export const useEditMemberInfo = (): EditMemberInfoMutationHookResult => {
  return useEditMemberInfoMutation()
}

export const getEditMemberInfoOptions = (
  request: EditMemberInfoInput,
): MutationFunctionOptions<
  EditMemberInfoMutation,
  EditMemberInfoMutationVariables
> => {
  return {
    variables: {
      request,
    },
    refetchQueries: [
      {
        query: GetMemberInfoDocument,
        variables: {
          memberId: request.memberId,
        },
      },
    ],
  }
}
