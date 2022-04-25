import React, { useMemo, useState } from 'react'
import { MemberContainer } from 'portals/hope/features/tasks/components/MemberContainer'
import { ClaimContainer } from 'portals/hope/features/tasks/components/ClaimContainer'
import formatDate from 'date-fns/format'
import { parseISO } from 'date-fns'
import { useTaskNavigation } from 'portals/hope/features/tasks/hooks/use-task-navigation'

interface TaskTab {
  title: string
  type: TabType
  render: () => React.ReactNode
  selected: boolean
  resourceId: string
}

interface UseTaskTabsResult {
  render: () => React.ReactNode
  tabs: TaskTab[]
  selectTab: (resourceId: string) => void
  closeTab: (resourceId: string) => void
  renameTab: (resourceId: string, name: string) => void
}

export type TabType = 'member' | 'claim'

export const useTaskTabs = (): UseTaskTabsResult => {
  const [taskNames, setTaskNames] = useState<Record<string, string>>({})

  const {
    navigate,
    params: { memberId, claimIds, tab, active, taskId },
  } = useTaskNavigation()

  const tabs = useMemo(() => {
    const newTabs: TaskTab[] = []

    if (memberId) {
      newTabs.push({
        title: taskNames[memberId] ?? 'Member',
        render: () => (
          <MemberContainer
            memberId={memberId}
            tab={tab ?? 'contracts'}
            title=""
            onChangeTab={(newTab) =>
              navigate(
                { memberId, tab: newTab, active: memberId, claimIds, taskId },
                { replace: true },
              )
            }
            onClickClaim={(newClaimId: string) =>
              navigate({
                memberId,
                tab,
                claimIds: [
                  ...claimIds.filter((id) => id !== newClaimId),
                  newClaimId,
                ],
                active: newClaimId,
                taskId,
              })
            }
          />
        ),
        type: 'member',
        resourceId: memberId,
        selected: active === memberId,
      })
    }

    if (claimIds.length) {
      const tabs: TaskTab[] = claimIds.map((id) => ({
        title: taskNames[id] ?? 'Claim',
        render: () => (
          <ClaimContainer
            claimId={id}
            onMounted={(claim) => {
              if (!claim?.registrationDate) return

              renameTabHandler(
                id,
                'Claim ' +
                  formatDate(
                    parseISO(claim?.registrationDate),
                    'dd MMMM, yyyy',
                  ),
              )
            }}
          />
        ),
        type: 'claim',
        resourceId: id,
        selected: active === id,
      }))

      newTabs.push(...tabs)
    }

    return newTabs
  }, [memberId, claimIds, tab, active, taskNames])

  const getTab = (resourceId: string) =>
    tabs.find((tab) => tab.resourceId === resourceId)

  const selectTabHandler = (resourceId: string) => {
    if (getTab(resourceId)) {
      navigate({ memberId, tab, claimIds, active: resourceId, taskId })
    }
  }

  const closeTabHandler = (resourceId: string) => {
    if (getTab(resourceId)) {
      navigate({
        memberId,
        tab,
        active: memberId,
        claimIds: claimIds.filter((id) => id !== resourceId),
        taskId,
      })
    }
  }

  const renameTabHandler = (resourceId: string, name: string) => {
    setTaskNames((prevTaskNames) => ({ ...prevTaskNames, [resourceId]: name }))
  }

  const render = () => {
    if (!active) return null

    const tabToRender = getTab(active)

    if (!tabToRender) return null

    return tabToRender.render()
  }

  return {
    render,
    tabs,
    selectTab: selectTabHandler,
    closeTab: closeTabHandler,
    renameTab: renameTabHandler,
  }
}
