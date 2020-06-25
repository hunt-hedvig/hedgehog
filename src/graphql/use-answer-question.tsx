import { MutationFunctionOptions } from '@apollo/react-common'
import {
  AnswerQuestionMutation,
  AnswerQuestionMutationVariables,
  GetQuestionsGroupsDocument,
  useAnswerQuestionMutation,
} from 'api/generated/graphql'

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
