import { Page } from 'portals/hope/pages/routes'
import styled from '@emotion/styled'
import React from 'react'
import { Flex } from '@hedvig-ui'

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

const TasksPage: Page = () => {
  return (
    <Flex style={{ marginTop: '-4rem', marginLeft: '-4rem' }}>
      <TaskNavigationWrapper />
      <TaskChatWrapper />
    </Flex>
  )
}

export default TasksPage
