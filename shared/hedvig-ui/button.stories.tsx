import { action } from '@storybook/addon-actions'
import { boolean, select } from '@storybook/addon-knobs'
import { Button, buttonColorMap, ButtonProps } from 'hedvig-ui/button'
import { lightTheme } from 'hedvig-ui/themes'
import React from 'react'
import { WithStory } from './story-utils'

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
