import { Button, ButtonProps } from '@hedvig-ui'
import { action } from '@storybook/addon-actions'
import { boolean, select } from '@storybook/addon-knobs'
import React from 'react'
import { WithStory } from '../story-utils'

export default {
  title: 'Button',
  component: Button,
}

const variants: ReadonlyArray<NonNullable<ButtonProps['variant']>> = [
  'primary',
  'secondary',
  'tertiary',
]

const sizes: ReadonlyArray<NonNullable<ButtonProps['size']>> = [
  'small',
  'medium',
  'large',
]

export const Text = () => {
  return (
    <Button
      onClick={action('clicked')}
      variant={select('variant', variants, 'primary')}
      size={select('Size', sizes, 'medium')}
      disabled={boolean('Disabled', false)}
    >
      Hello Button
    </Button>
  )
}

export const Emoji: React.FC & WithStory = () => (
  <Button
    onClick={action('clicked')}
    variant={select('variation', variants, 'primary')}
    size={select('Size', sizes, 'medium')}
  >
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
)

Emoji.story = {
  name: 'with emoji',
}
