import {
  GetQuestionsGroupsQueryHookResult,
  QuestionGroup,
  useGetQuestionsGroupsQuery,
} from 'api/generated/graphql'

type UseQuestionGroupsReturnTuple = [
  ReadonlyArray<QuestionGroup>,
  GetQuestionsGroupsQueryHookResult,
]

export const useQuestionGroups = (): UseQuestionGroupsReturnTuple => {
  const queryResult = useGetQuestionsGroupsQuery({
    pollInterval: 10000,
  })
  const questionGroups = (queryResult.data?.questionGroups ??
    []) as ReadonlyArray<QuestionGroup>
  return [questionGroups, queryResult]
}
