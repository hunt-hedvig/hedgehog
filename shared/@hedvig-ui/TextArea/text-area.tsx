import { css, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import { isPressing, Keys } from '@hedvig-ui'
import React, { useRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { FieldErrors } from 'react-hook-form'
import { ErrorMessage } from '@hookform/error-message'
import { Label } from '../Typography/typography'

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

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const Error = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.danger};
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
  wrapperStyle?: React.CSSProperties
  label?: string
  errors?: FieldErrors
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    { autoResize, onChange, label, errors, wrapperStyle, ...props },
    forwardRef,
  ) => {
    const defaultRef = useRef<HTMLTextAreaElement>(null)

    const ref = (forwardRef ??
      defaultRef) as React.RefObject<HTMLTextAreaElement>

    return (
      <Wrapper style={wrapperStyle}>
        <Label>{label}</Label>
        {autoResize ? (
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
        )}
        {props.name && errors && (
          <ErrorMessage
            errors={errors}
            name={props.name}
            render={({ message }) => <Error>{message}</Error>}
          />
        )}
      </Wrapper>
    )
  },
)
