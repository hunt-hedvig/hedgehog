import * as React from 'react'
import styled from 'react-emotion'
import { TextArea as SemanticTextArea } from 'semantic-ui-react'

const TextAreaWrapper = styled('div')({
  width: '100%',
})

export const TextArea: React.FunctionComponent<{
  placeholder: string
  setText: (value: string) => void
}> = ({ placeholder, setText }) => {
  return (
    <TextAreaWrapper className={'ui form'}>
      <SemanticTextArea
        autoHeight
        placeholder={placeholder}
        onChange={(_, { value }) => setText(value as string)}
      />
    </TextAreaWrapper>
  )
}
