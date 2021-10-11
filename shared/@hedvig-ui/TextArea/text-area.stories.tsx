import { NewTextArea, TextArea } from '@hedvig-ui'
import { boolean } from '@storybook/addon-knobs'
import React from 'react'

export default {
  title: 'TextArea',
  component: TextArea,
  decorators: [],
}

export const TextAreaThatGrows: React.FC = () => {
  const [text, setText] = React.useState('')
  return (
    <>
      <TextArea
        placeholder="Write your life story here..."
        value={text}
        onChange={setText}
      />
      <p>
        <strong>Written text:</strong> {text}
      </p>
    </>
  )
}

export const TextAreaNoSemantic: React.FC = () => {
  return (
    <div style={{ padding: '20px 40px' }}>
      <NewTextArea
        placeholder="Write your life story here..."
        resize={boolean('Resize', false)}
        autoresize={boolean('Auto resize', false)}
      />
    </div>
  )
}
