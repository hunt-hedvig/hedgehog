import gql from 'graphql-tag'
import {
  MyTasksDocument,
  MyTasksQuery,
  useResolveTaskMutation,
} from 'types/generated/graphql'
import { ApolloCache, NormalizedCacheObject } from '@apollo/client'

gql`
  mutation ResolveTask($taskId: ID!) {
    resolveTask(taskId: $taskId) {
      id
    }
  }
`

export const useResolveTask = () => {
  const [resolveTask, { loading }] = useResolveTaskMutation()

  const resolve = (taskId: string) =>
    resolveTask({
      variables: { taskId },
      optimisticResponse: {
        resolveTask: {
          __typename: 'Task',
          id: taskId,
        },
      },
      update: (cache: ApolloCache<NormalizedCacheObject>) => {
        const cachedData = cache.readQuery({
          query: MyTasksDocument,
        })

        const cachedTasks = (cachedData as MyTasksQuery)?.me?.user?.tasks

        if (!cachedTasks) {
          return
        }

        cache.writeQuery({
          query: MyTasksDocument,
          data: {
            me: {
              user: {
                tasks: cachedTasks.filter((task) => task.id !== taskId),
              },
            },
          },
        })
      },
    })

  return { resolve, loading }
}
