import { MutationFunctionOptions } from '@apollo/client'
import {
  AnswerQuestionMutation,
  AnswerQuestionMutationVariables,
  GetQuestionsGroupsDocument,
  useAnswerQuestionMutation,
} from 'types/generated/graphql'

export const useAnswerQuestion = () => useAnswerQuestionMutation()

export const getAnswerQuestionOptions = (
  memberId: string,
  answer: string,
): MutationFunctionOptions<
  AnswerQuestionMutation,
  AnswerQuestionMutationVariables
> => {
  return {
    variables: {
      memberId,
      answer,
    },
    refetchQueries: [
      {
        query: GetQuestionsGroupsDocument,
      },
    ],
  }
}
