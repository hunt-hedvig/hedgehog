import {
  QuestionsGroupsQueryHookResult,
  QuestionGroup,
  useQuestionsGroupsQuery,
} from 'types/generated/graphql'
import gql from 'graphql-tag'

type UseQuestionGroupsReturnTuple = [
  ReadonlyArray<QuestionGroup>,
  QuestionsGroupsQueryHookResult,
]

gql`
  query QuestionsGroups {
    questionGroups {
      id
      memberId
      memberId
      firstName
      lastName
      market
      pickedLocale
      questions {
        id
        messageJsonString
        timestamp
      }
    }
  }
`

export const useQuestionGroups = (
  pollInterval?: number,
): UseQuestionGroupsReturnTuple => {
  const queryResult = useQuestionsGroupsQuery({
    pollInterval: pollInterval ?? 5000,
  })

  const questionGroups = (queryResult.data?.questionGroups ??
    []) as ReadonlyArray<QuestionGroup>
  return [questionGroups, queryResult]
}
