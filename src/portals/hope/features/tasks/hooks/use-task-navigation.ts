import { useQueryParams } from '@hedvig-ui'
import { useHistory } from 'react-router'

interface UseTaskNavigateParameters {
  to: {
    taskId?: string | null
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
    taskId: string | null
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

    if (to?.taskId) params.push({ name: 'taskId', value: to.taskId })
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
      taskId: queryParams.get('taskId'),
    },
  }
}
