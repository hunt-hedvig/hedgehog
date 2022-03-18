import { Page } from 'portals/hope/pages/routes'
import styled from '@emotion/styled'
import React, { useEffect, useState } from 'react'
import { Flex, Placeholder } from '@hedvig-ui'
import chroma from 'chroma-js'
import { useQuestionGroups } from 'portals/hope/features/questions/hooks/use-question-groups'
import { Question, QuestionGroup } from 'types/generated/graphql'
import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import {
  doMarketFilter,
  doMemberGroupFilter,
} from 'portals/hope/features/questions/utils'
import { useNumberMemberGroups } from 'portals/hope/features/user/hooks/use-number-member-groups'
import {
  getMemberFlag,
  getMemberIdColor,
} from 'portals/hope/features/member/utils'
import { PickedLocale } from 'portals/hope/features/config/constants'
import { useTitle } from '@hedvig-ui/hooks/use-title'
import { MemberContainer } from '../../features/tasks/components/MemberContainer'
import { TaskChat } from '../../features/tasks/TaskChat'
import { FilterModal } from 'portals/hope/features/tasks/components/FilterModal'
import { useSelectedFilters } from 'portals/hope/features/questions/hooks/use-selected-filters'
import { useResolveQuestion } from 'portals/hope/features/questions/hooks/use-resolve-question'
import { RouteComponentProps, useHistory } from 'react-router'

const TaskNavigationWrapper = styled.div`
  height: 100%;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.2);
  clip-path: inset(0px -10rem 0px 0px);
  background-color: white;

  min-width: 70%;

  margin-left: -4rem;
  overflow-y: hidden;
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
  width: 100%;
`

const TopBarItem = styled.button<{ selected?: boolean }>`
  background-color: ${({ theme, selected }) =>
    selected
      ? 'transparent'
      : chroma(theme.semiStrongForeground).alpha(0.05).hex()};
  border: none;
  cursor: pointer;
  padding: 2rem 2rem;

  display: flex;
  align-items: center;

  color: ${({ theme, selected }) =>
    selected
      ? undefined
      : chroma(theme.semiStrongForeground).brighten(2).hex()};

  transition: color 200ms;
  :hover {
    color: ${({ theme }) => chroma(theme.semiStrongForeground).alpha(4).hex()};
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

const FilterBarItem = styled.button`
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

const ListContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  ::-webkit-scrollbar-track {
    background: transparent;
  }

  padding-bottom: 10rem;
`

const ListItem = styled.div<{ selected?: boolean }>`
  display: flex;
  font-size: 1rem;
  padding: 1.2rem 2.05rem;
  cursor: pointer;

  transition: background-color 200ms;

  :hover {
    background-color: ${({ theme }) =>
      chroma(theme.accent).alpha(0.2).brighten(2).hex()};
  }

  background-color: ${({ selected, theme }) =>
    selected ? chroma(theme.accent).alpha(0.2).brighten(1).hex() : undefined};

  .orb {
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 3rem;

    div {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;

      background-color: transparent;
    }
  }

  .flag {
    padding: 0 2rem;
  }

  .name {
    width: 30%;
    padding-right: 2rem;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    div {
      color: ${({ theme }) => theme.accent};
      transition: color 200ms;

      :hover {
        color: ${({ theme }) => theme.accentLight};
      }
    }
  }

  .preview {
    width: 70%;
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1).hex()};

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .options {
    width: 10rem;
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1).hex()};

    text-align: right;
  }
`

const Container = styled(Flex)`
  margin-top: -4rem;
  padding-left: 4rem;
  overflow-y: auto;
  width: calc(100% + 4rem);
  margin-left: -4rem;
`

const getQuestionBody = (question: Question) => {
  try {
    return JSON.parse(question.messageJsonString).body
  } catch (e) {
    return ''
  }
}

const getMemberName = (group: QuestionGroup) => {
  return group.firstName && group.lastName
    ? `${group.firstName} ${group.lastName}`
    : undefined
}

const TasksPage: Page<
  RouteComponentProps<{
    memberId?: string
    tab?: string
  }>
> = ({ match }) => {
  const history = useHistory()
  const memberId = match.params.memberId
  const tab = match.params.tab

  const { resolve } = useResolveQuestion()
  const { numberMemberGroups } = useNumberMemberGroups()
  const [questionGroups] = useQuestionGroups()
  const { selectedFilters: filters, toggleFilter } = useSelectedFilters()

  const [showFilters, setShowFilters] = useState(false)

  const [selectedQuestionGroup, setSelectedQuestionGroup] =
    useState<QuestionGroup | null>(null)
  const [selectedMemberId, setSelectedMemberId] = useState<null | string>(null)

  const groups =
    filters.length > 0
      ? questionGroups
          .filter(doMemberGroupFilter(numberMemberGroups)(filters))
          .filter(doMarketFilter(filters))
      : questionGroups

  const groupByRoute = groups.find((group) => group.memberId === memberId)

  useEffect(() => {
    if (groupByRoute) {
      setSelectedMemberId(groupByRoute.memberId)
      setSelectedQuestionGroup(groupByRoute)
      return
    }

    history.replace('/questions')
    setSelectedQuestionGroup(null)
    setSelectedMemberId(null)
  }, [memberId, groupByRoute])

  const title = `Questions ${groups.length ? '(' + groups.length + ')' : ''}`

  useTitle(title)

  return (
    <>
      <Container>
        <TaskNavigationWrapper>
          <>
            <TopBar>
              <Flex>
                <TopBarItem
                  selected={!selectedMemberId}
                  onClick={() => history.replace(`/questions`)}
                >
                  Incoming questions
                  <div className="count">{groups.length}</div>
                </TopBarItem>
                {selectedQuestionGroup && selectedMemberId && (
                  <TopBarItem selected={true}>
                    {getMemberName(selectedQuestionGroup) ?? 'Member'}
                  </TopBarItem>
                )}
              </Flex>
              <FilterBarItem onClick={() => setShowFilters(true)}>
                Filters
              </FilterBarItem>
            </TopBar>
            {selectedMemberId && (
              <ListContainer>
                <MemberContainer
                  memberId={selectedMemberId}
                  tab={tab ?? 'contracts'}
                  title={title}
                  onChangeTab={(newTab) =>
                    history.replace(`/questions/${selectedMemberId}/${newTab}`)
                  }
                />
              </ListContainer>
            )}
            {!selectedMemberId && (
              <ListContainer>
                {groups.map((group) => {
                  const previewQuestion = group?.questions?.slice(-1)[0] ?? ''
                  const preview = getQuestionBody(previewQuestion)

                  const orbColor = getMemberIdColor(
                    group.memberId,
                    numberMemberGroups,
                  )

                  const flag = group.market
                    ? getMemberFlag(
                        {
                          market: group.market ?? '',
                        },
                        group.pickedLocale as PickedLocale,
                      )
                    : '🏳'

                  return (
                    <ListItem
                      key={group.id}
                      onClick={() => setSelectedQuestionGroup(group)}
                      selected={
                        group.memberId === selectedQuestionGroup?.memberId
                      }
                    >
                      <div className="orb">
                        <div style={{ backgroundColor: orbColor }} />
                      </div>
                      <div className="flag">{flag}</div>
                      <span className="name">
                        {getMemberName(group) ? (
                          <div
                            onClick={() => {
                              history.replace(`/questions/${group.memberId}`)
                              setSelectedQuestionGroup(group)
                            }}
                          >
                            {getMemberName(group)}
                          </div>
                        ) : (
                          <Placeholder>Name not available</Placeholder>
                        )}
                      </span>
                      <span className="preview">{preview.text}</span>
                      <div className="options">
                        {formatDistanceToNowStrict(
                          parseISO(previewQuestion.timestamp),
                          {
                            addSuffix: true,
                          },
                        )}
                      </div>
                    </ListItem>
                  )
                })}
              </ListContainer>
            )}
          </>
        </TaskNavigationWrapper>
        <TaskChatWrapper>
          {selectedQuestionGroup && (
            <TaskChat
              memberId={selectedQuestionGroup.memberId}
              fullName={getMemberName(selectedQuestionGroup)}
              onResolve={() => {
                resolve(selectedQuestionGroup.memberId)
                history.replace(`/questions`)
              }}
              onSelectMember={() => {
                history.replace(`/questions/${selectedQuestionGroup.memberId}`)
              }}
            />
          )}
        </TaskChatWrapper>
      </Container>

      {showFilters && (
        <FilterModal
          onClose={() => setShowFilters(false)}
          filters={filters}
          onToggle={toggleFilter}
        />
      )}
    </>
  )
}

export default TasksPage
