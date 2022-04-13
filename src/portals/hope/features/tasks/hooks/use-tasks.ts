import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import { useQuestionGroups } from 'portals/hope/features/filters/hooks/use-question-groups'
import { useSelectedFilters } from 'portals/hope/features/filters/hooks/use-selected-filters'
import { QuestionGroup } from 'types/generated/graphql'
import { useEffect, useState } from 'react'
import { useResolveQuestion } from 'portals/hope/features/filters/hooks/use-resolve-question'
import { useMemberName } from 'portals/hope/common/hooks/use-member-name'
import { useQueryParams } from '@hedvig-ui'
import { useHistory } from 'react-router'
import { useTaskTabs } from 'portals/hope/features/tasks/hooks/use-task-tabs'
import {
  doMarketFilter,
  doMemberGroupFilter,
} from 'portals/hope/features/filters/FilterSelect'

interface UseTaskNavigateParameters {
  to: {
    memberId?: string | null
    tab?: string | null
    claimIds?: string | string[] | null
    active?: string | null
  }
  options?: { replace?: boolean; meta?: Record<string, string> }
}

interface UseTaskNavigationResult {
  navigate: (
    to: UseTaskNavigateParameters['to'],
    options?: UseTaskNavigateParameters['options'],
  ) => void
  params: {
    memberId: string | null
    tab: string | null
    claimIds: string[]
    active: string | null
  }
}

export const useTaskNavigation = (): UseTaskNavigationResult => {
  const history = useHistory()

  const navigationHandler = (
    to: UseTaskNavigateParameters['to'],
    options?: UseTaskNavigateParameters['options'],
  ) => {
    const params = []

    if (to?.memberId) params.push({ name: 'memberId', value: to.memberId })
    if (to?.tab) params.push({ name: 'tab', value: to.tab })
    if (to?.claimIds) {
      if (Array.isArray(to.claimIds)) {
        to.claimIds.forEach((id) => params.push({ name: 'claimId', value: id }))
      } else params.push({ name: 'claimId', value: to.claimIds })
    }
    if (to?.active) params.push({ name: 'active', value: to.active })

    const parsedParams = params.map(({ name, value }) => `${name}=${value}`)

    const newUrl = `/questions?` + parsedParams.join('&')

    if (options?.replace) {
      history.replace(newUrl)
    } else history.push(newUrl)
  }

  const queryParams = useQueryParams()

  return {
    navigate: navigationHandler,
    params: {
      memberId: queryParams.get('memberId'),
      tab: queryParams.get('tab'),
      claimIds: queryParams.getAll('claimId'),
      active: queryParams.get('active'),
    },
  }
}

const useIncomingTasks = () => {
  const { numberMemberGroups } = useNumberMemberGroups()
  const [questionGroups, { loading }] = useQuestionGroups()
  const { selectedFilters } = useSelectedFilters()

  const tasks =
    selectedFilters.length > 0
      ? questionGroups
          .filter(doMemberGroupFilter(numberMemberGroups)(selectedFilters))
          .filter(doMarketFilter(selectedFilters))
      : questionGroups

  return { tasks, loading }
}

// Temporary abstraction
type Task = QuestionGroup

interface UseTasksVariables {
  params: {
    memberId?: string | null
  }
  onResolve?: (memberId: string) => void
  onSelect?: (task: Task | null) => void
}
export const useTasks = ({
  params: { memberId },
  onResolve,
  onSelect,
}: UseTasksVariables) => {
  const { fullName: fullNameByQuery } = useMemberName(memberId ?? '')
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const { tasks: incomingTasks, loading } = useIncomingTasks()
  const { resolve } = useResolveQuestion()
  const { render, tabs, selectTab, closeTab, renameTab } = useTaskTabs()

  const taskByRoute = incomingTasks.find((task) => task.memberId === memberId)
  const activeTask = selectedTask ?? taskByRoute

  useEffect(() => {
    if (!activeTask) return
    const name = fullName(activeTask)

    if (!name) return
    renameTab(activeTask.memberId, name)
  }, [activeTask])

  const setActiveTaskHandler = (task: Task | null) => {
    setSelectedTask(task)
    onSelect?.(task)

    if (task) {
      const name = fullName(task)
      if (name) renameTab(task.memberId, name)
    }
  }

  const resolveTaskHandler = (memberIdToResolve: string, autoSelect = true) => {
    if (!activeTask) return

    if (autoSelect) {
      const activeGroupIndex = incomingTasks.findIndex(
        (group) => group.memberId === activeTask?.memberId,
      )

      if (activeGroupIndex !== -1) {
        const hasMoreGroups = activeGroupIndex < incomingTasks.length - 2

        if (incomingTasks.length > 0 && hasMoreGroups) {
          setSelectedTask(incomingTasks[activeGroupIndex + 1])
        }

        if (incomingTasks.length > 0 && !hasMoreGroups) {
          setSelectedTask(incomingTasks[0])
        }
      }
    }

    resolve(memberIdToResolve).then(() => onResolve?.(memberIdToResolve))
  }

  const fullName = (task?: Task | null) => {
    if (!task?.firstName || !task?.lastName) return fullNameByQuery ?? null

    return `${task.firstName} ${task.lastName}`
  }

  return {
    incomingTasks,
    loading,
    selectTask: setActiveTaskHandler,
    activeTask,
    resolveTask: resolveTaskHandler,
    activeTaskMeta: {
      fullName: fullName(activeTask),
    },
    render,
    tabs,
    selectTab,
    closeTab,
  }
}
