import { Page } from 'portals/hope/pages/routes'
import styled from '@emotion/styled'
import React, { useState } from 'react'
import { Flex, Label, Modal } from '@hedvig-ui'
import chroma from 'chroma-js'
import { useQuestionGroups } from 'portals/hope/features/questions/hooks/use-question-groups'
import { Question, QuestionGroup } from 'types/generated/graphql'
import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import { MessagesList } from 'portals/hope/features/member/messages/MessagesList'
import { TaskChatInput } from 'portals/hope/features/tasks/components/TaskChatInput'
import { useSelectedFilters } from 'portals/hope/features/questions/hooks/use-selected-filters'
import { FilterSelect } from 'portals/hope/features/questions/FilterSelect'
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
import { NumberMemberGroupsRadioButtons } from 'portals/hope/features/questions/number-member-groups-radio-buttons'
import { useTitle } from '@hedvig-ui/hooks/use-title'

const TaskNavigationWrapper = styled.div`
  height: 100%;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.2);
  clip-path: inset(0px -10rem 0px 0px);
  background-color: white;

  min-width: 60%;

  margin-left: -4rem;
  overflow-y: hidden;
`

const TaskChatWrapper = styled.div`
  position: relative;
  height: 100%;
  min-width: 40%;
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
  background-color: transparent;
  border: none;
  cursor: pointer;
  padding: 1.8rem 2rem;

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

const FilterModal = styled(Modal)`
  width: 60rem;

  padding: 1.5rem 1.5rem 5rem;

  h4 {
    font-size: 1.4rem;
  }

  p {
    font-size: 1rem;
    color: ${({ theme }) => theme.semiStrongForeground};
  }

  .tip {
    margin-top: 0.5rem;
    margin-bottom: -0.5rem;
    font-size: 0.8rem;
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1).hex()};
    text-align: center;
  }
`

const getQuestionBody = (question: Question) => {
  try {
    return JSON.parse(question.messageJsonString).body
  } catch (e) {
    return ''
  }
}

const TasksPage: Page = () => {
  const { numberMemberGroups } = useNumberMemberGroups()
  const { selectedFilters, toggleFilter } = useSelectedFilters()

  const [showFilters, setShowFilters] = useState(false)

  const [isLarge, setIsLarge] = useState(false)
  const [selectedQuestionGroup, setSelectedQuestionGroup] =
    useState<QuestionGroup | null>(null)
  const [questionGroups] = useQuestionGroups()

  const groups =
    selectedFilters.length > 0
      ? questionGroups
          .filter(doMemberGroupFilter(numberMemberGroups)(selectedFilters))
          .filter(doMarketFilter(selectedFilters))
      : questionGroups

  useTitle(`Questions ${groups.length ? '(' + groups.length + ')' : ''}`)

  return (
    <>
      <Container>
        <TaskNavigationWrapper>
          <TopBar>
            <TopBarItem selected={true}>
              Incoming questions
              <div className="count">{groups.length}</div>
            </TopBarItem>
            <FilterBarItem onClick={() => setShowFilters(true)}>
              Filters
            </FilterBarItem>
          </TopBar>
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
                  selected={group.memberId === selectedQuestionGroup?.memberId}
                >
                  <div className="orb">
                    <div style={{ backgroundColor: orbColor }} />
                  </div>
                  <div className="flag">{flag}</div>
                  <span className="name">
                    <a
                      href={`/members/${group.memberId}`}
                      target="_blank"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {(group?.firstName ?? '') + ' ' + (group?.lastName ?? '')}
                    </a>
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
        </TaskNavigationWrapper>
        <TaskChatWrapper>
          {selectedQuestionGroup && (
            <>
              <div
                style={{
                  height: isLarge ? 'calc(100% - 27rem)' : 'calc(100% - 15rem)',
                  transition: 'height 200ms',
                }}
              >
                <MessagesList
                  memberId={selectedQuestionGroup.memberId}
                  style={{
                    padding: '2rem',
                    marginBottom: '6rem',
                    paddingBottom: '0',
                  }}
                />
              </div>
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  minHeight: '10rem',
                }}
              >
                <TaskChatInput
                  onResize={() => setIsLarge(!isLarge)}
                  isLarge={isLarge}
                  memberId={selectedQuestionGroup.memberId}
                  onBlur={() => void 0}
                  onFocus={() => void 0}
                  onResolve={() =>
                    setSelectedQuestionGroup(
                      questionGroups.length !== 0 ? questionGroups[0] : null,
                    )
                  }
                />
              </div>
            </>
          )}
        </TaskChatWrapper>
      </Container>
      {showFilters && (
        <FilterModal onClose={() => setShowFilters(false)}>
          <Flex
            style={{ height: '100%', width: '100%' }}
            direction="column"
            justify="space-between"
          >
            <div>
              <h4>Select Filters</h4>

              <Flex
                style={{
                  flexWrap: 'wrap',
                  marginTop: '3rem',
                }}
                justify="space-between"
              >
                <Flex
                  direction="column"
                  align="center"
                  fullWidth
                  style={{ marginBottom: '2rem' }}
                >
                  <Label>Number of member groups</Label>
                  <NumberMemberGroupsRadioButtons />
                </Flex>
                <FilterSelect
                  filters={selectedFilters}
                  onToggle={toggleFilter}
                  animationDelay={0}
                  animationItemDelay={20}
                />
              </Flex>
            </div>
          </Flex>
        </FilterModal>
      )}
    </>
  )
}

export default TasksPage
