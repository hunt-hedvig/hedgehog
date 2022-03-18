import gql from 'graphql-tag'
import {
  AuthenticationDocument,
  GetQuestionsGroupsDocument,
  GetQuestionsGroupsQuery,
  useMarkQuestionAsResolvedMutation,
} from 'types/generated/graphql'

gql`
  mutation MarkQuestionAsResolved($memberId: ID!) {
    markQuestionAsResolved(memberId: $memberId)
  }
`

export const useResolveQuestion = () => {
  const [markAsResolved, { loading }] = useMarkQuestionAsResolvedMutation({
    refetchQueries: [
      {
        query: GetQuestionsGroupsDocument,
      },
    ],
  })

  const resolve = (memberId: string) =>
    markAsResolved({
      variables: { memberId },
      optimisticResponse: {
        markQuestionAsResolved: true,
      },
      update: (cache) => {
        const cachedData = cache.readQuery({
          query: AuthenticationDocument,
        })

        const cachedGroups = (cachedData as GetQuestionsGroupsQuery)
          ?.questionGroups

        if (!cachedGroups) {
          return
        }

        cache.writeQuery({
          query: GetQuestionsGroupsDocument,
          data: {
            questionGroups: cachedGroups.filter(
              (group) => group.memberId !== memberId,
            ),
          },
        })
      },
    })

  return {
    loading,
    resolve,
  }
}
