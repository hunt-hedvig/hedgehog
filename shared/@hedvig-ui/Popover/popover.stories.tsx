import styled from '@emotion/styled'
import { Popover } from '@hedvig-ui'
import { action } from '@storybook/addon-actions'
import React from 'react'

export default {
  title: 'Popover',
  component: Popover,
}

const PopoverWrapper = styled.div`
  display: inline-block;
  padding-top: 5rem;
  padding-left: 5rem;

  color: ${({ theme }) => theme.foreground};
`

export const StandardPopover = () => (
  <PopoverWrapper>
    <Popover
      contents={<>I'm a popover</>}
      onOpen={action('Open')}
      onClose={action('Close')}
    >
      Hover me
    </Popover>
  </PopoverWrapper>
)
