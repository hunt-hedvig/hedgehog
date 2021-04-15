import styled from '@emotion/styled'
import { boolean } from '@storybook/addon-knobs'
import { Loadable } from 'hedvig-ui/loadable'
import React from 'react'

export default {
  title: 'Loadable',
  component: Loadable,
}

const Wrapper = styled.div`
  max-width: 500px;
  padding: 2rem;
`

export const StandardLoadable = () => {
  return (
    <Wrapper>
      <Loadable loading={boolean('loading', false)}>
        <div>
          Item a <br /> Some content
        </div>
        <div>Item b</div>
        <div>Item c</div>
        <div>Item d</div>
        <div>Item e</div>
        <div>Item f</div>
        <div>Item g</div>
      </Loadable>
    </Wrapper>
  )
}
