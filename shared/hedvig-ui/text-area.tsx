import styled from '@emotion/styled'
import React from 'react'
import { TextArea as SemanticTextArea } from 'semantic-ui-react'

const TextAreaWrapper = styled('div')({
  width: '100%',
})

export const TextArea: React.FunctionComponent<{
  placeholder: string
  value: string
  setValue: (value: string) => void
}> = ({ placeholder, value: inputValue, setValue: setInputValue }) => {
  return (
    <TextAreaWrapper className={'ui form'}>
      <SemanticTextArea
        autoHeight
        placeholder={placeholder}
        value={inputValue}
        onChange={(_, { value }) => setInputValue(value as string)}
      />
    </TextAreaWrapper>
  )
}
