import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { colorsV3, fonts } from '@hedviginsurance/brand'
import React, { useEffect, useRef } from 'react'
import {
  Input as SemanticInput,
  InputProps,
  LabelProps,
  Ref,
} from 'semantic-ui-react'

export interface CustomInputProps extends InputProps {
  muted?: boolean
  affix?: LabelProps
  affixPosition?: 'left' | 'right'
  focus?: boolean
}

const StyledSemanticInput = styled(SemanticInput)<CustomInputProps>`
  &&&& {
    width: 100%;
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    input {
      font-family: ${fonts.FAVORIT};

      transition: background 300ms, border-color 300ms;
      ${({ muted, theme }) =>
        muted
          ? css`
              background-color: ${theme.mutedBackground ?? colorsV3.gray300};
              border-color: ${theme.mutedBackground ?? colorsV3.gray300};
              color: ${theme.mutedText ?? colorsV3.gray500};
            `
          : css`
              :focus {
                border-color: ${theme.accent};
              }
            `}

  }
`

export const Input: React.FC<CustomInputProps> = ({ focus, ...props }) => {
  const inputRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (inputRef.current && focus) {
      inputRef.current.focus()
    }
  }, [focus])

  return (
    <Ref innerRef={inputRef}>
      <StyledSemanticInput {...props} />
    </Ref>
  )
}
