import { Input } from '@hedvig-ui'
import { boolean, select } from '@storybook/addon-knobs'
import React from 'react'

export default {
  title: 'Input',
  component: Input,
}

export const StandardInput: React.FC = () => {
  const [text, setText] = React.useState<string>('')

  return (
    <>
      <Input
        size={select('Size', ['small', 'medium', 'big'], 'medium')}
        disabled={boolean('Disabled', false)}
        loading={boolean('Loading', false)}
        success={boolean('Successs', false)}
        onChange={({ target: { value } }) => setText(value)}
        error={boolean('Error', false)}
        placeholder="Write your life story here..."
      />
      <p>
        <strong>Written text:</strong> {text}
      </p>
    </>
  )
}
