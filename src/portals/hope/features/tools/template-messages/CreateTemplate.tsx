import React from 'react'
import styled from '@emotion/styled'

const Content = styled.div`
  flex: 1;
  border: 2px solid red;

  display: flex;
  align-items: center;
  justify-content: center;
`

export const CreateTemplate = () => {
  return (
    <Content>
      <h1>Hello</h1>
    </Content>
  )
}
