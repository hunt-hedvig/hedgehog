import { MutationFunctionOptions } from '@apollo/client'
import {
  GetQuestionsGroupsDocument,
  MarkQuestionAsResolvedMutation,
  MarkQuestionAsResolvedMutationVariables,
  useMarkQuestionAsResolvedMutation,
} from 'types/generated/graphql'

export const useMarkQuestionAsResolved = () =>
  useMarkQuestionAsResolvedMutation()

export const getMarkQuestionAsResolvedOptions = (
  memberId: string,
): MutationFunctionOptions<
  MarkQuestionAsResolvedMutation,
  MarkQuestionAsResolvedMutationVariables
> => {
  return {
    variables: {
      memberId,
    },
    refetchQueries: [
      {
        query: GetQuestionsGroupsDocument,
      },
    ],
  }
}
