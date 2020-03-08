import { TextArea } from 'hedvig-ui/text-area'
import * as React from 'react'

export default {
  title: 'TextArea',
  component: TextArea,
  decorators: [],
}

export const TextAreaThatGrows: React.FunctionComponent = () => {
  const [text, setText] = React.useState('')
  return (
    <>
      <TextArea
        placeholder={'Write your life story here...'}
        setText={setText}
      />
      <p>
        <b>Written text:</b> {text}
      </p>
    </>
  )
}
