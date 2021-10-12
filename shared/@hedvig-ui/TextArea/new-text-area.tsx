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

    &::placeholder {
      color: ${theme.semiStrongForeground};
    }
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
  maxHeight?: string
}>`
  ${({ theme, resize, maxHeight }) => styles(theme, resize, maxHeight)}
`

interface TextAreaProps
  extends Omit<React.HTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value: string | undefined
  maxHeight?: string
  resize?: boolean
  onChange: (value: string) => void
  focus?: boolean
  autoresize?: boolean
}

export const TextArea: React.FC<TextAreaProps> = ({
  autoresize,
  value,
  focus,
  onChange,
  ...props
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (focus && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [focus])

  return autoresize ? (
    <TextareaAutosizeStyled
      ref={textareaRef}
      value={value || ''}
      maxHeight={props.maxHeight}
      onKeyDown={props.onKeyDown}
      onChange={(e) => onChange(e.currentTarget.value as string)}
      placeholder={props.placeholder}
      resize={props.resize}
    />
  ) : (
    <TextAreaStyled
      ref={textareaRef}
      onChange={(e) => onChange(e.currentTarget.value as string)}
      value={value || ''}
      {...props}
    />
  )
}
