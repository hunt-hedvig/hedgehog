import { OrbColors, OrbIndicator, OrbSizes } from '@hedvig-ui'
import { select } from '@storybook/addon-knobs'
import React from 'react'

export default {
  title: 'OrbIndicator',
  component: OrbIndicator,
  decorators: [],
}

export const OrbIndicatorStandard = () => {
  return (
    <>
      <OrbIndicator
        color={select('Color: ', OrbColors, 'green')}
        size={select('Size: ', OrbSizes, 'large')}
      />
    </>
  )
}
