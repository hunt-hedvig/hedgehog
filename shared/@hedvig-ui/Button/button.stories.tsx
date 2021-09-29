import { Button, ButtonProps } from '@hedvig-ui'
import { action } from '@storybook/addon-actions'
import { boolean, select } from '@storybook/addon-knobs'
import React from 'react'

export default {
  title: 'Button',
  component: Button,
}

const variants: ReadonlyArray<NonNullable<ButtonProps['variant']>> = [
  'primary',
  'secondary',
  'tertiary',
]

const statuses: ReadonlyArray<NonNullable<ButtonProps['status']>> = [
  'success',
  'warning',
  'danger',
]

const sizes: ReadonlyArray<NonNullable<ButtonProps['size']>> = [
  'small',
  'medium',
  'large',
]

export const Text = () => {
  return (
    <Button
      onClick={action('Clicked')}
      variant={select('Variant', variants, 'primary')}
      status={select('Status', statuses, undefined)}
      size={select('Size', sizes, 'medium')}
      disabled={boolean('Disabled', false)}
    >
      Hello Button
    </Button>
  )
}
