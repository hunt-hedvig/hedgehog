import { OrbIndicator } from '@hedvig-ui'
import { text } from '@storybook/addon-knobs'
import React from 'react'

export default {
  title: 'OrbIndicator',
  component: OrbIndicator,
  decorators: [],
}

export const OrbIndicatorStandard = () => {
  return (
    <>
      <OrbIndicator color={text('Color: ', '')} size={text('Size: ', '14px')} />
    </>
  )
}
