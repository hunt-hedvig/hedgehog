import styled from '@emotion/styled'
import React from 'react'
import { TextArea as SemanticTextArea, TextAreaProps } from 'semantic-ui-react'

const TextAreaWrapper = styled.div`
  width: 100%;
`

const StyledSemanticTextArea = styled(SemanticTextArea)`
  min-height: 3em;
  overflow: hidden;
  resize: none;
  height: 100%;
`

export const TextArea: React.FC<{
  placeholder: string
  value: string | undefined
  onChange: (value: string) => void
} & Omit<TextAreaProps, 'onChange'>> = ({
  placeholder,
  value: inputValue,
  onChange,
  ...props
}) => {
  return (
    <TextAreaWrapper className={'ui form'}>
      <StyledSemanticTextArea
        placeholder={placeholder}
        value={inputValue}
        onChange={(_, { value }) => onChange(value as string)}
        {...props}
      />
    </TextAreaWrapper>
  )
}
