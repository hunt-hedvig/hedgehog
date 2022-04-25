import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import { useSelectedFilters } from 'portals/hope/features/filters/hooks/use-selected-filters'
import {
  doMarketFilter,
  doMemberGroupFilter,
} from 'portals/hope/features/filters/FilterSelect'
import gql from 'graphql-tag'
import { QuestionGroup, Task, useMyTasksQuery } from 'types/generated/graphql'

gql`
  query MyTasks {
    me {
      user {
        tasks {
          id
          title
          description
          createdAt
          resource {
            ... on QuestionGroup {
              id
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
        }
      }
    }
  }
`

interface UseIncomingTasksOptions {
  pollInterval?: number
  filter?: boolean
}

export const useIncomingTasks = (options?: UseIncomingTasksOptions) => {
  const { data, loading } = useMyTasksQuery({
    pollInterval: options?.pollInterval,
  })

  const { numberMemberGroups } = useNumberMemberGroups()
  const { selectedFilters } = useSelectedFilters()

  const unfilteredTasks = (data?.me?.user?.tasks ?? []) as Task[]

  const questionGroupFilterHandler = (tasks: Task[]) => {
    if (selectedFilters.length) {
      return tasks
        .filter((task) =>
          doMemberGroupFilter(numberMemberGroups)(selectedFilters)(
            task.resource as QuestionGroup,
          ),
        )
        .filter((task) =>
          doMarketFilter(selectedFilters)(task.resource as QuestionGroup),
        )
    }

    return tasks
  }

  const tasks = options?.filter
    ? questionGroupFilterHandler(unfilteredTasks)
    : unfilteredTasks

  return { tasks, loading }
}
