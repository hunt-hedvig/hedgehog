import { select, withKnobs } from '@storybook/addon-knobs'
import * as React from 'react'

import { action } from '@storybook/addon-actions'
import { Button } from 'hedvig-ui/button'
import { buttonColorMap, buttonSizeMap } from './button'
import { WithStory } from './story-utils'

export default {
  title: 'Button',
  component: Button,
  decorators: [withKnobs],
}

const colors = Object.keys(buttonColorMap)
const sizes = Object.keys(buttonSizeMap)

export const Text = () => {
  return (
    <Button
      onClick={action('clicked')}
      type={select('Type', colors, 'primary')}
      size={select('Size', sizes, 'md')}
    >
      Hello Button
    </Button>
  )
}

export const Emoji: React.FC & WithStory = (blah) => (
  <Button
    onClick={action('clicked')}
    type={select('Type', colors, 'primary')}
    size={select('Size', sizes, 'md')}
  >
    <span role="img" aria-label="so cool">
      😀 😎 👍 💯
    </span>
  </Button>
)

Emoji.story = {
  name: 'with emoji',
}
