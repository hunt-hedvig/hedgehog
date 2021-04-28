import { boolean } from '@storybook/addon-knobs'
import { Input } from 'hedvig-ui/input'
import React from 'react'

export default {
  title: 'Input',
  component: Input,
}

export const StandardInput: React.FC = () => {
  const [text, setText] = React.useState('')
  return (
    <>
      <Input
        placeholder={'Write your life story here...'}
        value={text}
        onChange={(_e, { value }) => setText(value)}
        muted={boolean('Muted', false)}
      />
      <p>
        <strong>Written text:</strong> {text}
      </p>
    </>
  )
}
