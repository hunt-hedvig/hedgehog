import * as React from 'react'
import styled from 'react-emotion'
import { TextArea as SemanticTextArea } from 'semantic-ui-react'

const TextAreaWrapper = styled('div')({
  width: '100%',
})

export const TextArea: React.FunctionComponent<{
  placeholder: string
  value: string
  setText: (value: string) => void
}> = ({ placeholder, value, setText }) => {
  return (
    <TextAreaWrapper className={'ui form'}>
      <SemanticTextArea
        autoHeight
        placeholder={placeholder}
        value={value}
        onChange={(_, { value }) => setText(value as string)}
      />
    </TextAreaWrapper>
  )
}
