import { Task } from 'types/generated/graphql'
import { useTaskTabs } from 'portals/hope/features/tasks/hooks/use-task-tabs'
import { useIncomingTasks } from 'portals/hope/features/tasks/hooks/use-incoming-tasks'
import { useResolveTask } from 'portals/hope/features/tasks/hooks/use-resolve-task'
import { useTaskNavigation } from 'portals/hope/features/tasks/hooks/use-task-navigation'

interface UseTasksVariables {
  params: {
    taskId?: string | null
  }
  onResolve?: (taskId: string) => void
  onSelect?: (task: Task | null) => void
}

export const useTasks = ({ onResolve }: UseTasksVariables) => {
  const { tasks: incomingTasks, loading } = useIncomingTasks({
    pollInterval: 5000,
    filter: true,
  })

  const {
    navigate,
    params: { taskId },
  } = useTaskNavigation()

  const { resolve } = useResolveTask()
  const { render, tabs, selectTab, closeTab } = useTaskTabs()

  const selectedTask = incomingTasks.find((task) => task?.id === taskId)

  const resolveTaskHandler = (taskId: string, autoSelect = true) => {
    if (!selectedTask) return

    if (autoSelect) {
      const selectedTaskIndex = incomingTasks.findIndex(
        (task) => task.id === selectedTask.id,
      )

      if (selectedTaskIndex !== -1) {
        const hasMoreTasks = selectedTaskIndex < incomingTasks.length - 2

        if (incomingTasks.length > 0 && hasMoreTasks) {
          const nextTask = incomingTasks[selectedTaskIndex + 1]
          navigate({ taskId: nextTask.id })
        }

        if (incomingTasks.length > 0 && !hasMoreTasks) {
          const nextTask = incomingTasks[0]
          navigate({ taskId: nextTask.id })
        }
      }
    }

    resolve(taskId).then(() => onResolve?.(taskId))
  }

  return {
    incomingTasks,
    loading,
    activeTask: selectedTask,
    resolveTask: resolveTaskHandler,
    render,
    tabs,
    selectTab,
    closeTab,
  }
}
