import { TextArea } from '@hedvig-ui'
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
