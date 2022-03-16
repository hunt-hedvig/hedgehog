import { Page } from 'portals/hope/pages/routes'
import styled from '@emotion/styled'
import React from 'react'
import { Flex } from '@hedvig-ui'
import chroma from 'chroma-js'

const TaskNavigationWrapper = styled.div`
  height: 100%;
  width: 100%;
  box-shadow: 0 0 2rem rgba(0, 0, 0, 0.2);
  clip-path: inset(0px -10rem 0px 0px);
  background-color: white;
`

const TaskChatWrapper = styled.div`
  height: 100%;
  min-width: 37rem;
`

const TopBar = styled.div`
  display: flex;
  border-bottom: 1px solid
    ${({ theme }) => chroma(theme.semiStrongForeground).brighten(3).hex()};
  width: 100%;
`

const TopBarItem = styled.button<{ selected?: boolean }>`
  background-color: transparent;

  border: none;
  cursor: pointer;

  display: flex;
  align-items: center;
  padding: 1.8rem 2rem;

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

const TasksPage: Page = () => {
  return (
    <Flex style={{ marginTop: '-4rem', marginLeft: '-4rem' }}>
      <TaskNavigationWrapper>
        <TopBar>
          <TopBarItem selected={true}>
            Incoming questions
            <div className="count">10</div>
          </TopBarItem>
        </TopBar>
      </TaskNavigationWrapper>
      <TaskChatWrapper />
    </Flex>
  )
}

export default TasksPage
