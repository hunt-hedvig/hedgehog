import { Page } from 'portals/hope/pages/routes'
import styled from '@emotion/styled'
import React, { useState } from 'react'
import { Flex } from '@hedvig-ui'
import chroma from 'chroma-js'
import { CaretDownFill } from 'react-bootstrap-icons'
import { useQuestionGroups } from 'portals/hope/features/questions/hooks/use-question-groups'
import { Question, QuestionGroup } from 'types/generated/graphql'
import { formatDistanceToNowStrict, parseISO } from 'date-fns'
import { MessagesList } from 'portals/hope/features/member/messages/MessagesList'

const TaskNavigationWrapper = styled.div`
  height: 100%;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.2);
  clip-path: inset(0px -10rem 0px 0px);
  background-color: white;

  margin-left: -4rem;
`

const TaskChatWrapper = styled.div`
  height: 100%;
  width: 100%;
  min-width: 37rem;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    appearance: none;
    width: 0;
    display: none;
  }
`

const TopBar = styled.div`
  display: flex;
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

const FilterBar = styled.div`
  display: flex;
  border-bottom: 1px solid
    ${({ theme }) => chroma(theme.semiStrongForeground).brighten(3.25).hex()};
  width: 100%;
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
`

const ListItem = styled.div<{ selected?: boolean }>`
  display: flex;
  font-size: 1rem;
  padding: 1.2rem 2.05rem;
  cursor: pointer;

  transition: background-color 200ms;

  :hover {
    background-color: ${({ theme }) =>
      chroma(theme.highlight).alpha(0.25).hex()};
  }

  background-color: ${({ selected, theme }) =>
    selected ? chroma(theme.highlight).alpha(0.25).hex() : undefined};

  .name {
    min-width: 18rem;
    padding-right: 2rem;
    width: 30%;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .preview {
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1).hex()};

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    width: 50%;
  }

  .options {
    color: ${({ theme }) =>
      chroma(theme.semiStrongForeground).brighten(1).hex()};

    min-width: 10rem;
    width: 20%;
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

const TasksPage: Page = () => {
  const [selectedQuestionGroup, setSelectedQuestionGroup] =
    useState<QuestionGroup | null>(null)
  const [questionGroups] = useQuestionGroups()

  return (
    <Container>
      <TaskNavigationWrapper>
        <TopBar>
          <TopBarItem selected={true}>
            Incoming questions
            <div className="count">10</div>
          </TopBarItem>
        </TopBar>
        <FilterBar>
          <FilterBarItem>
            All questions <CaretDownFill className="icon" />
          </FilterBarItem>
        </FilterBar>
        <ListContainer>
          {questionGroups.map((group) => {
            const previewQuestion = group?.questions?.slice(-1)[0] ?? ''
            const preview = getQuestionBody(previewQuestion)

            return (
              <ListItem
                key={group.id}
                onClick={() => setSelectedQuestionGroup(group)}
                selected={group.memberId === selectedQuestionGroup?.memberId}
              >
                <span className="name">
                  {(group?.firstName ?? '') + ' ' + (group?.lastName ?? '')}
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
          <MessagesList
            memberId={selectedQuestionGroup.memberId}
            style={{
              padding: '2rem',
            }}
          />
        )}
      </TaskChatWrapper>
    </Container>
  )
}

export default TasksPage
