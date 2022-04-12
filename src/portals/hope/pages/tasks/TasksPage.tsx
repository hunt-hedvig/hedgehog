import { Page } from 'portals/hope/pages/routes'
import styled from '@emotion/styled'
import React, { useState } from 'react'
import { Flex, useTitle } from '@hedvig-ui'
import chroma from 'chroma-js'
import { PickedLocale } from 'portals/hope/features/config/constants'
import { TaskChat } from '../../features/tasks/TaskChat'
import { FilterModal } from 'portals/hope/features/tasks/components/FilterModal'
import { useHistory } from 'react-router'
import { motion } from 'framer-motion'
import {
  formatLocale,
  useTemplateMessages,
} from '../../features/template-messages/use-template-messages'
import { TaskListItem } from 'portals/hope/features/tasks/components/TaskListItem'
import {
  useTaskNavigation,
  useTasks,
} from 'portals/hope/features/tasks/hooks/use-tasks'
import { ChevronLeft, X } from 'react-bootstrap-icons'
import { useCheckInOut } from 'portals/hope/features/tasks/hooks/use-check-in-out'
import { CheckInMessage } from 'portals/hope/features/tasks/CheckInMessage'

const TaskNavigationWrapper = styled.div<{ fullWidth: boolean }>`
  height: 100%;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.2);
  clip-path: inset(0px -10rem 0px 0px);
  background-color: white;

  min-width: ${({ fullWidth }) => (fullWidth ? 'calc(100% + 4rem)' : '70%')};
  overflow: hidden;

  margin-left: -4rem;

  display: flex;
  flex-direction: column;
`

const TaskChatWrapper = styled.div`
  position: relative;
  height: 100%;
  min-width: 30%;
  width: 100%;

  &::-webkit-scrollbar {
    appearance: none;
    width: 0;
    display: none;
  }
`

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid
    ${({ theme }) => chroma(theme.semiStrongForeground).brighten(3.25).hex()};
`

const CheckInBar = styled.div`
  padding: 2rem 2rem 2rem 4rem;

  background-color: ${({ theme }) =>
    chroma(theme.semiStrongForeground).brighten(3.5).hex()};
`

// noinspection CssInvalidPropertyValue
const TabContainer = styled.div`
  display: flex;
  width: 100%;

  overflow-x: overlay;

  ::-webkit-scrollbar {
    height: 0.5rem;
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) =>
      chroma(theme.semiStrongForeground).alpha(0.2).hex()};
  }

  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
`

const TopBarItem = styled.button<{ selected?: boolean }>`
  display: flex;
  align-items: center;

  .title {
    transition: color 200ms;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 2rem 2rem;

  color: ${({ theme, selected }) =>
    selected
      ? undefined
      : chroma(theme.semiStrongForeground).brighten(2).hex()};

  transition: color 200ms;

  .back-button {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.accent};

    svg {
      margin-right: 0.5rem;
    }
  }

  .close-button {
    color: ${({ theme }) => theme.accent};
    transition: background-color 200ms;
    opacity: 0;

    background-color: ${({ theme }) => chroma(theme.accent).alpha(0.1).hex()};

    border-radius: 50%;
    width: 1.4rem;
    height: 1.4rem;
    margin-left: 1rem;
    margin-right: -2.4rem;
  }

  :hover {
    .title {
      color: ${({ theme }) =>
        chroma(theme.semiStrongForeground).alpha(4).hex()};
    }

    .close-button {
      opacity: 1;
      visibility: visible;
    }

    .back-button {
      color: ${({ theme }) => chroma(theme.accent).brighten(2).hex()};

      svg {
        fill: ${({ theme }) => chroma(theme.accent).brighten(2).hex()};
      }
    }
  }

  .count {
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(2).hex()};
    display: inline-block;
    font-size: 1.1rem;
    margin-left: 1rem;
    margin-top: 0.1rem;
  }
`

const FilterBarItem = styled(motion.button)`
  background-color: transparent;
  transition: background-color 200ms;
  :hover {
    background-color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(3.25).hex()};
  }
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;
  margin: 1.8rem 2rem;

  padding: 0.4rem 0.6rem;

  font-size: 0.8rem;
  color: ${({ theme }) => chroma(theme.semiStrongForeground).brighten(1).hex()};

  .icon {
    width: 0.6rem;
    height: 0.6rem;
    margin-left: 0.15rem;
  }
`

const ListContainer = styled(motion.ul)`
  flex: 1;
  width: 100%;
  overflow-y: scroll;
  overflow-x: hidden;

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  & {
    margin: 0;
    padding: 0;
  }
`

const Container = styled(Flex)`
  margin-top: -4rem;
  padding-left: 4rem;
  overflow-y: hidden;
  width: calc(100% + 4rem);
  margin-left: -4rem;
`

const TasksPage: Page = () => {
  const history = useHistory()
  const { loading, checkedIn } = useCheckInOut()
  const [showFilters, setShowFilters] = useState(false)
  const { setLocale, setMemberId, changeLocaleDisplayed } =
    useTemplateMessages()

  const {
    navigate,
    params: { memberId },
  } = useTaskNavigation()

  const {
    incomingTasks: groups,
    activeTask,
    activeTaskMeta: { fullName },
    selectTask,
    resolveTask,
    render,
    tabs,
    selectTab,
    closeTab,
  } = useTasks({
    params: { memberId },
    onResolve: () => history.replace(`/questions`),
    onSelect: (task) => {
      if (!task) return

      setMemberId(task.memberId)

      if (
        task.pickedLocale &&
        formatLocale(task.pickedLocale as PickedLocale, true) ===
          formatLocale(PickedLocale.EnSe, true)
      ) {
        changeLocaleDisplayed(task.memberId, true)
      }

      setLocale((task.pickedLocale || PickedLocale.SvSe) as PickedLocale)
    },
  })

  const title = memberId
    ? `Questions | ${fullName}`
    : `Questions ${groups.length ? '(' + groups.length + ')' : ''}`

  useTitle(title, [fullName])

  return (
    <>
      <Container>
        <TaskNavigationWrapper fullWidth={!(activeTask || memberId)}>
          <>
            <TopBar>
              {!tabs.length ? (
                <TopBarItem
                  selected={!memberId}
                  onClick={() => history.push(`/questions`)}
                  style={{ minWidth: '20rem' }}
                >
                  Incoming questions
                  <div className="count">{groups.length}</div>
                </TopBarItem>
              ) : (
                <TopBarItem
                  selected={!memberId}
                  onClick={() => history.push(`/questions`)}
                >
                  <div className="back-button">
                    <ChevronLeft />
                    Back
                  </div>
                </TopBarItem>
              )}
              <TabContainer>
                {tabs.map(({ selected, title, resourceId, type }, index) => (
                  <div key={title + index}>
                    <TopBarItem
                      selected={selected}
                      onClick={() => selectTab(resourceId)}
                    >
                      <div className="title">{title}</div>
                      {type === 'claim' && (
                        <motion.div
                          whileHover={{ scale: 1.15 }}
                          style={{ display: 'flex', alignItems: 'center' }}
                        >
                          <X
                            onClick={(e) => {
                              closeTab(resourceId)
                              e.stopPropagation()
                            }}
                            className="close-button"
                          />
                        </motion.div>
                      )}
                    </TopBarItem>
                  </div>
                ))}
              </TabContainer>
              {!memberId && (
                <FilterBarItem
                  onClick={() => setShowFilters(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Filters
                </FilterBarItem>
              )}
            </TopBar>
            {!(loading || checkedIn) && !memberId && (
              <CheckInBar>
                <CheckInMessage />
              </CheckInBar>
            )}
            {!memberId ? (
              <ListContainer>
                {groups.map((group) => (
                  <TaskListItem
                    disabled={!checkedIn}
                    key={group.id}
                    group={group}
                    onClick={() => selectTask(group)}
                    selected={group.memberId === activeTask?.memberId}
                  />
                ))}
              </ListContainer>
            ) : (
              <ListContainer>{render()}</ListContainer>
            )}
          </>
        </TaskNavigationWrapper>
        {(activeTask || memberId) && (
          <TaskChatWrapper>
            <TaskChat
              resolvable={!!activeTask && checkedIn}
              memberId={activeTask?.memberId || memberId || ''}
              fullName={fullName}
              onResolve={() => activeTask && resolveTask(activeTask.memberId)}
              onSelectMember={(openClaimId) => {
                if (!activeTask) return

                if (!openClaimId) {
                  navigate({
                    memberId: activeTask.memberId,
                    active: activeTask.memberId,
                  })
                } else {
                  navigate({
                    memberId: activeTask.memberId,
                    tab: 'claims',
                    active: openClaimId,
                    claimIds: openClaimId,
                  })
                }
              }}
            />
          </TaskChatWrapper>
        )}
      </Container>

      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </>
  )
}

export default TasksPage
