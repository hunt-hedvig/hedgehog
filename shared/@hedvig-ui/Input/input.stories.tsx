import { Input } from '@hedvig-ui'
import { boolean, select } from '@storybook/addon-knobs'
import React, { useEffect } from 'react'

export default {
  title: 'Input',
  component: Input,
}

export const StandardInput: React.FC = () => {
  const [text, setText] = React.useState<string>('')
  const [affix, setAffix] = React.useState<boolean>(false)
  const isAffix = boolean('Affix', false)

  useEffect(() => {
    setAffix(isAffix)
  }, [isAffix])

  return (
    <>
      <Input
        size={select('Size', ['small', 'medium', 'large'], 'medium')}
        disabled={boolean('Disabled', false)}
        loading={boolean('Loading', false)}
        success={boolean('Successs', false)}
        onChange={({ target: { value } }) => setText(value)}
        error={boolean('Error', false)}
        placeholder="Write your life story here..."
        style={{ marginBottom: 15 }}
        affix={
          affix
            ? {
                content: 'SEK',
              }
            : undefined
        }
      />
      <p>
        <strong>Written text:</strong> {text}
      </p>
    </>
  )
}
