import styled from '@emotion/styled'
import React, { useEffect, useRef } from 'react'
import {
  Ref,
  TextArea as SemanticTextArea,
  TextAreaProps,
} from 'semantic-ui-react'
import { sleep } from 'utils/sleep'

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
  focus?: boolean
} & Omit<TextAreaProps, 'onChange'>> = ({
  placeholder,
  value: inputValue,
  onChange,
  focus,
  ...props
}) => {
  const textAreaRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setTimeout(() => {
      if (textAreaRef.current && focus) {
        textAreaRef.current.focus()
      }
    }, 1)
  }, [focus])

  return (
    <TextAreaWrapper className="ui form">
      <Ref innerRef={textAreaRef}>
        <StyledSemanticTextArea
          placeholder={placeholder}
          value={inputValue}
          onChange={(_, { value }) => onChange(value as string)}
          {...props}
        />
      </Ref>
    </TextAreaWrapper>
  )
}
