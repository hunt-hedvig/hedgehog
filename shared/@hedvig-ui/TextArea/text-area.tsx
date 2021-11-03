import { css, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import React, { useEffect, useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'

const styles = (theme: Theme, resize?: boolean, maxHeight?: string) => css`
  min-height: 75px;
  max-height: ${maxHeight || 'none'};
  width: 100%;
  border: 1px solid ${theme.accentBackground};
  outline: none;
  border-radius: 0.2rem;
  resize: ${resize ? 'vertical' : 'none'};
  padding: 11px 14px;
  font-size: 14px;

  &::placeholder {
    color: ${theme.placeholderColor};
  }

  &:focus {
    border: 1px solid ${theme.border};
  }
`

const TextAreaStyled = styled.textarea<{
  resize?: boolean
  maxHeight?: string
}>`
  ${({ theme, resize, maxHeight }) => styles(theme, resize, maxHeight)}
`

const TextareaAutosizeStyled = styled(TextareaAutosize)<{
  resize?: boolean
  maxiheight?: string
}>`
  ${({ theme, resize, maxiheight }) => styles(theme, resize, maxiheight)}
`

export interface TextAreaProps
  extends React.HTMLAttributes<HTMLTextAreaElement> {
  value?: string
  name?: string
  maxHeight?: string
  resize?: boolean
  focus?: boolean
  autoResize?: boolean
}

export const TextArea: React.FC<TextAreaProps> = ({
  autoResize,
  value,
  focus,
  onChange,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setTimeout(() => {
      if (focus && textareaRef.current) {
        textareaRef.current.focus()
      }
    }, 0)
  }, [focus])

  return autoResize ? (
    <TextareaAutosizeStyled
      ref={textareaRef}
      value={value || ''}
      maxiheight={props.maxHeight}
      onKeyDown={props.onKeyDown}
      onChange={onChange}
      placeholder={props.placeholder}
      resize={props.resize}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
      name={props.name}
    />
  ) : (
    <TextAreaStyled
      ref={textareaRef}
      onChange={onChange}
      value={value || ''}
      {...props}
    />
  )
}
