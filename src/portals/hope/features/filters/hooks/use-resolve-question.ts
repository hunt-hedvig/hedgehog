import gql from 'graphql-tag'
import {
  QuestionsGroupsDocument,
  QuestionsGroupsQuery,
  useMarkQuestionAsResolvedMutation,
} from 'types/generated/graphql'
import { ApolloCache, NormalizedCacheObject } from '@apollo/client'

gql`
  mutation MarkQuestionAsResolved($memberId: ID!) {
    markQuestionAsResolved(memberId: $memberId)
  }
`

export const useResolveQuestion = () => {
  const [markAsResolved, { loading }] = useMarkQuestionAsResolvedMutation()

  const resolve = (memberId: string) =>
    markAsResolved({
      variables: { memberId },
      optimisticResponse: {
        markQuestionAsResolved: true,
      },
      update: (cache: ApolloCache<NormalizedCacheObject>) => {
        const cachedData = cache.readQuery({
          query: QuestionsGroupsDocument,
        })

        const cachedGroups = (cachedData as QuestionsGroupsQuery)
          ?.questionGroups

        if (!cachedGroups) {
          return
        }

        cache.writeQuery({
          query: QuestionsGroupsDocument,
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