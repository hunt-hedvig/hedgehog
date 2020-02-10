import { action } from '@storybook/addon-actions'
import { select, withKnobs } from '@storybook/addon-knobs'
import { Button, buttonColorMap, ButtonProps } from 'hedvig-ui/button'
import * as React from 'react'
import { WithStory } from './story-utils'

export default {
  title: 'Button',
  component: Button,
  decorators: [withKnobs],
}

const colors: ReadonlyArray<ButtonProps['type']> = Object.keys(
  buttonColorMap,
) as any
const sizes: ReadonlyArray<NonNullable<ButtonProps['size']>> = [
  'mini',
  'tiny',
  'small',
  'medium',
  'large',
  'big',
  'huge',
  'massive',
]

export const Text = () => {
  return (
    <Button
      onClick={action('clicked')}
      type={select('Type', colors, 'primary')}
      size={select('Size', sizes, 'medium')}
    >
      Hello Button
    </Button>
  )
}

export const Emoji: React.FC & WithStory = () => (
  <Button
    onClick={action('clicked')}
    type={select('Type', colors, 'primary')}
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
