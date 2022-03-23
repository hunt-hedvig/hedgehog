import { css, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { isPressing, Keys } from '@hedvig-ui/hooks/keyboard/use-key-is-pressed'
import React, { useRef } from 'react'
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
  maxHeight?: string
}>`
  ${({ theme, resize, maxHeight }) => styles(theme, resize, maxHeight)}
`

export interface TextAreaProps
  extends React.HTMLAttributes<HTMLTextAreaElement> {
  value?: string
  name?: string
  maxHeight?: string
  resize?: boolean
  autoResize?: boolean
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ autoResize, onChange, ...props }, forwardRef) => {
    const defaultRef = useRef<HTMLTextAreaElement>(null)

    const ref = (forwardRef ??
      defaultRef) as React.RefObject<HTMLTextAreaElement>

    return autoResize ? (
      <TextareaAutosizeStyled
        ref={ref}
        value={props.value || ''}
        maxHeight={props.maxHeight}
        onChange={onChange}
        placeholder={props.placeholder}
        resize={props.resize}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        name={props.name}
        onKeyDown={(e) => {
          props.onKeyDown?.(e)
          if (isPressing(e, Keys.Escape)) {
            ref?.current?.blur()
          }
        }}
      />
    ) : (
      <TextAreaStyled
        ref={ref}
        onChange={onChange}
        onKeyDown={(e) => {
          if (isPressing(e, Keys.Escape)) {
            ref?.current?.blur()
          }
        }}
        {...props}
      />
    )
  },
)
