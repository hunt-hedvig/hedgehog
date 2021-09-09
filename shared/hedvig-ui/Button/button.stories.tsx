import { Button, buttonColorMap, ButtonProps } from '@hedvig-ui'
import { action } from '@storybook/addon-actions'
import { boolean, select } from '@storybook/addon-knobs'
import { lightTheme } from 'hedvig-ui'
import React from 'react'
import { WithStory } from '../story-utils'

export default {
  title: 'Button',
  component: Button,
}

const colors: ReadonlyArray<NonNullable<
  ButtonProps['variation']
>> = Object.keys(buttonColorMap(lightTheme)) as any
const sizes: ReadonlyArray<NonNullable<ButtonProps['size']>> = [
  'small',
  'medium',
  'large',
]

export const Text = () => {
  return (
    <Button
      onClick={action('clicked')}
      variation={select('variation', colors, 'primary')}
      size={select('Size', sizes, 'medium')}
      basic={boolean('Basic', false)}
      loading={boolean('Loading', false)}
    >
      Hello Button
    </Button>
  )
}

export const Emoji: React.FC & WithStory = () => (
  <Button
    onClick={action('clicked')}
    variation={select('variation', colors, 'primary')}
    size={select('Size', sizes, 'medium')}
    basic={boolean('Basic', false)}
  >
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
)

Emoji.story = {
  name: 'with emoji',
}
