import { boolean, select } from '@storybook/addon-knobs'
import { Badge, BadgeProps } from 'hedvig-ui/badge'

import React from 'react'

const sizes: ReadonlyArray<NonNullable<BadgeProps['size']>> = [
  'small',
  'medium',
  'large',
]

const variants: ReadonlyArray<NonNullable<BadgeProps['variant']>> = [
  'danger',
  'warning',
  'success',
  'default',
]

export const StandardBadge: React.FC = () => {
  return (
    <>
      <Badge
        size={select('Size', sizes, 'small')}
        fluid={boolean('Fluid', false)}
        centered={boolean('Centered', true)}
        bold={boolean('Bold', false)}
        variant={select('Variant', variants, 'default')}
      >
        Badge
      </Badge>
    </>
  )
}

export default {
  title: 'Badge',
  component: Badge,
}
