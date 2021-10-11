import { css, Theme } from '@emotion/react'
import styled from '@emotion/styled'
import React from 'react'
import TextareaAutosize from 'react-textarea-autosize'

const styles = (theme: Theme, resize?: boolean) => css`
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

const TextAreaStyled = styled.textarea<{ resize?: boolean }>`
  ${({ theme, resize }) => styles(theme, resize)}
`

const TextareaAutosizeStyled = styled(TextareaAutosize)<{ resize?: boolean }>`
  ${({ theme, resize }) => styles(theme, resize)}
`

interface TextAreaProps extends React.HTMLAttributes<HTMLTextAreaElement> {
  resize?: boolean
  autoresize?: boolean
}

export const TextArea: React.FC<TextAreaProps> = ({ autoresize, ...props }) =>
  autoresize ? (
    <TextareaAutosizeStyled resize={props.resize} />
  ) : (
    <TextAreaStyled {...props} />
  )
